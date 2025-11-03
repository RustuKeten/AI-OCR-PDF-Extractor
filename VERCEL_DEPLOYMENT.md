# Vercel Deployment Checklist 🚀

## Pre-Deployment Checklist

### ✅ 1. Environment Variables Setup in Vercel

Go to your Vercel project settings > Environment Variables and add:

#### Required Variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Stripe (Test Mode first, then switch to Live Mode later)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
STRIPE_PRICE_BASIC=price_your_basic_monthly_price_id
STRIPE_PRICE_PRO=price_your_pro_monthly_price_id
```

**Important Notes:**
- ✅ Use **Live Mode** keys for production (`sk_live_` and `pk_live_`)
- ✅ Use **Live Mode** Price IDs for production
- ✅ `NEXTAUTH_URL` must match your Vercel deployment URL (https://your-domain.vercel.app)
- ✅ Generate a new `NEXTAUTH_SECRET` for production (don't reuse development secret)
- ✅ Use production database URL (not localhost)

### ✅ 2. Database Setup

1. **Supabase Production Database**:
   - Ensure your Supabase project is set up
   - Get production connection string
   - Update `DATABASE_URL` in Vercel

2. **Run Database Migrations**:
   ```bash
   # In your local environment (connected to production database)
   DATABASE_URL="your-production-database-url" npx prisma migrate deploy
   ```

   Or use Vercel CLI:
   ```bash
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

### ✅ 3. Stripe Webhook Configuration

**After deploying to Vercel**, configure the webhook in Stripe Dashboard:

1. Go to **Stripe Dashboard** > **Developers** > **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://your-domain.vercel.app/api/webhooks/stripe`
4. **Description**: "Production Webhook Endpoint"
5. **Events to send** (select these):
   - ✅ `checkout.session.completed`
   - ✅ `invoice.paid`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `customer.subscription.created`
6. Click **Add endpoint**
7. **Copy the Signing secret** (starts with `whsec_`)
8. **Update `STRIPE_WEBHOOK_SECRET`** in Vercel environment variables

**⚠️ Important**: The webhook secret is different for each endpoint. Make sure to use the production webhook secret, not the test one.

### ✅ 4. Stripe Products & Prices (Live Mode)

1. **Switch to Live Mode** in Stripe Dashboard (toggle in top right)
2. **Create Products**:
   - Basic Plan: $10/month
   - Pro Plan: $20/month
3. **Copy Price IDs** (they start with `price_`)
4. **Update in Vercel**:
   - `STRIPE_PRICE_BASIC=price_live_basic_id`
   - `STRIPE_PRICE_PRO=price_live_pro_id`

### ✅ 5. Build Configuration

Vercel will automatically detect Next.js and run `npm run build`, which includes Prisma generation.

**Build Command**: Already configured in `package.json`:
```json
"build": "prisma generate && next build"
```

### ✅ 6. Domain Configuration

1. In Vercel dashboard, go to your project
2. Navigate to **Settings** > **Domains**
3. Add your custom domain (optional)
4. Update `NEXTAUTH_URL` to match your custom domain if using one

## Post-Deployment Steps

### ✅ 1. Test Authentication

1. Visit your deployed site
2. Try signing up with a new account
3. Test sign in
4. Verify dashboard access

### ✅ 2. Test PDF Upload

1. Upload a test PDF
2. Verify extraction works
3. Check credits are deducted
4. Verify data is saved to database

### ✅ 3. Test Stripe Integration

#### Test Subscription Flow:

1. Go to Settings page
2. Click "Subscribe to Basic" or "Subscribe to Pro"
3. Use Stripe **Test Card** in Live Mode:
   - Success: `4242 4242 4242 4242`
   - Any future expiry date (e.g., 12/25)
   - Any CVC (e.g., 123)
4. Complete checkout
5. Verify:
   - ✅ User redirected back to settings
   - ✅ Credits added to account
   - ✅ Plan type updated
   - ✅ "Manage Billing" button appears

#### Test Webhooks:

1. Go to **Stripe Dashboard** > **Webhooks**
2. Click on your webhook endpoint
3. Go to **Recent events** tab
4. Verify events are being received:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `invoice.paid` (on renewal)
5. Check your application logs in Vercel for webhook processing

#### Test Customer Portal:

1. As a subscribed user, click "Manage Billing"
2. Verify redirect to Stripe Customer Portal
3. Test updating payment method
4. Test canceling subscription
5. Verify plan resets to FREE after cancellation

### ✅ 4. Verify Credit System

1. **Test Insufficient Credits**:
   - Use up credits (upload multiple PDFs)
   - Try uploading when credits < 100
   - Verify friendly error message appears
   - Verify upgrade prompt is shown

2. **Test Monthly Renewal**:
   - Create a subscription
   - Manually trigger invoice in Stripe Dashboard (for testing)
   - Or wait for monthly renewal
   - Verify credits are added automatically

### ✅ 5. Monitor Logs

Check Vercel deployment logs:

1. Go to **Vercel Dashboard** > Your Project > **Deployments**
2. Click on latest deployment
3. Check **Functions** tab for API route logs
4. Look for:
   - Webhook processing logs
   - Credit deduction logs
   - Error logs

## Common Issues & Solutions

### Issue: Webhook Not Receiving Events

**Solution:**
1. Verify webhook URL is correct: `https://your-domain.vercel.app/api/webhooks/stripe`
2. Check webhook secret matches in Vercel environment variables
3. Ensure endpoint is configured in Stripe Dashboard (Live Mode)
4. Check Vercel function logs for errors

### Issue: Subscription Not Activating

**Solution:**
1. Check webhook events in Stripe Dashboard
2. Verify `checkout.session.completed` event is being sent
3. Check Vercel logs for webhook processing errors
4. Verify database connection in production
5. Check user's `subscriptionId` is being saved

### Issue: Credits Not Adding

**Solution:**
1. Verify `invoice.paid` webhook is configured
2. Check webhook secret is correct
3. Verify `PLAN_CREDITS` values match your plan configuration
4. Check database for credit updates in `users` table

### Issue: Build Fails

**Solution:**
1. Check if all environment variables are set in Vercel
2. Verify `STRIPE_SECRET_KEY` is set (even if empty, the app handles it)
3. Check Prisma generation is working
4. Review build logs for specific errors

## Testing Checklist

- [ ] Authentication (sign up, sign in, sign out)
- [ ] Dashboard access (protected route)
- [ ] PDF upload and extraction
- [ ] Credit deduction after extraction
- [ ] Insufficient credits error handling
- [ ] Subscription checkout flow
- [ ] Webhook processing (`checkout.session.completed`)
- [ ] Credits added after subscription
- [ ] Plan type updated after subscription
- [ ] Customer portal access
- [ ] Subscription cancellation
- [ ] Plan reset to FREE after cancellation
- [ ] Monthly renewal (or manual invoice trigger test)
- [ ] Credits added on renewal

## Security Reminders

1. ✅ **Never commit** `.env.local` or `.env.production` to Git
2. ✅ Use **strong** `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
3. ✅ Use **Live Mode** keys for production (never use test keys)
4. ✅ Enable **webhook signature verification** (already implemented)
5. ✅ Use **HTTPS only** in production (Vercel handles this)
6. ✅ Review Vercel environment variables access permissions

## Useful Commands

```bash
# Pull production environment variables locally
vercel env pull .env.production

# Run migrations against production database
npx prisma migrate deploy

# Check deployment status
vercel ls

# View logs
vercel logs

# Test webhook locally with Stripe CLI (for debugging)
stripe listen --forward-to https://your-domain.vercel.app/api/webhooks/stripe
```

## Support & Debugging

- **Vercel Logs**: Dashboard > Project > Deployments > View Function Logs
- **Stripe Dashboard**: Developers > Webhooks > View event logs
- **Database**: Use Prisma Studio or Supabase Dashboard
- **Next.js**: Check Vercel function logs for API route errors

---

**Good luck with your deployment! 🚀**

Once deployed, make sure to:
1. ✅ Update Stripe webhook endpoint URL
2. ✅ Test all subscription flows
3. ✅ Monitor webhook events
4. ✅ Test credit system end-to-end
5. ✅ Verify all environment variables are set correctly

