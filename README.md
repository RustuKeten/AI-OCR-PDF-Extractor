# PDF Extractor AI

Advanced AI-powered PDF data extraction and resume parsing application built with Next.js, Prisma, NextAuth, and Supabase. Extract structured resume data from both text-based and image-based PDFs using OpenAI's GPT-4 and Vision APIs.

## ✨ Features

### Core Functionality

- ✅ **Smart PDF Extraction**: Extract structured data from PDF resumes using OpenAI GPT-4
- ✅ **Image-Based PDF Support**: OCR processing for scanned/image-based PDFs using GPT-4 Vision
- ✅ **Dual Processing Modes**: Automatically detects and handles both text-based and image-based PDFs
- ✅ **Structured JSON Output**: Returns well-organized JSON data following a consistent schema order

### User Management

- ✅ **Authentication**: Secure user authentication with NextAuth.js (email/password)
- ✅ **Credits System**: Credit-based processing (100 credits per file, 1000 credits for new users)
- ✅ **User Dashboard**: Track files, credits, and processing history
- ✅ **File History**: Complete history of all uploaded and processed files

### User Interface

- ✅ **Modern UI**: Beautiful, responsive interface with dark mode support
- ✅ **Theme Support**: Light, dark, and system theme preferences
- ✅ **File Management**: View, download, and delete uploaded files
- ✅ **Resume Data Viewer**: Modal view for extracted resume data with JSON copy functionality
- ✅ **Real-time Updates**: Auto-refresh for processing status
- ✅ **Toast Notifications**: User-friendly feedback for all actions
- ✅ **Landing Page**: Professional marketing page with features and benefits

### Database & Storage

- ✅ **PostgreSQL Database**: Robust database via Supabase with Prisma ORM
- ✅ **File Metadata**: Track file size, upload date, and processing status
- ✅ **Data Persistence**: All extracted data saved to database
- ✅ **Complete History**: Full audit trail of all file operations

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 6.18.0
- **Authentication**: NextAuth.js 4.24.12
- **Styling**: Tailwind CSS v4
- **AI Models**:
  - OpenAI GPT-4o-mini (text-based PDFs)
  - OpenAI GPT-4o (image-based PDFs with Vision API)
- **UI Components**: Custom components with Lucide React icons
- **File Upload**: react-dropzone for drag-and-drop functionality
- **Notifications**: react-hot-toast
- **Theme**: next-themes

## 📋 Prerequisites

- **Node.js**: 18+
- **Package Manager**: npm or yarn
- **Supabase Account**: For PostgreSQL database ([sign up here](https://supabase.com))
- **OpenAI API Key**: For PDF extraction ([get one here](https://platform.openai.com/api-keys))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/RustuKeten/AI-OCR-PDF-Extracter.git
cd AI-OCR-PDF-Extracter
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database - Get from Supabase Dashboard > Settings > Database
# Connection string format: postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# NextAuth Configuration
# Generate a secret key: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3002"
NEXTAUTH_SECRET="your-secret-key-here"

# OpenAI API Key
OPENAI_API_KEY="your-openai-api-key-here"
```

### 4. Set Up Supabase Database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Navigate to **Settings** > **Database**
3. Copy the connection string from **Connection string** section (use "URI" format)
4. Update `DATABASE_URL` in your `.env.local` file

### 5. Run Database Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Create initial migration and apply to database
npm run prisma:migrate

# (Optional) Open Prisma Studio to view/manage your database
npm run prisma:studio
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

## 📁 Project Structure

```
├── prisma/
│   └── schema.prisma              # Database schema (User, File, ResumeData, etc.)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts  # NextAuth API routes
│   │   │   ├── extract/
│   │   │   │   └── route.ts      # Direct PDF extraction API
│   │   │   └── files/
│   │   │       ├── route.ts      # GET: List user files
│   │   │       ├── upload/
│   │   │       │   └── route.ts  # POST: Upload & process file
│   │   │       ├── credits/
│   │   │       │   └── route.ts  # GET: Get user credits
│   │   │       └── [id]/
│   │   │           └── route.ts  # GET/DELETE: File operations
│   │   ├── auth/
│   │   │   ├── signin/
│   │   │   │   └── page.tsx      # Sign in/Sign up page
│   │   │   └── error/
│   │   │       └── page.tsx      # Auth error page
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Main dashboard
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Home/landing page
│   │   └── globals.css           # Global styles & theme
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   └── pdf-uploader.tsx  # Drag-and-drop uploader
│   │   ├── dashboard/            # Dashboard-specific components
│   │   │   ├── stats-section.tsx     # Statistics cards
│   │   │   ├── upload-section.tsx    # Upload area
│   │   │   ├── files-section.tsx     # File history list
│   │   │   ├── resume-modal.tsx      # Resume data viewer
│   │   │   └── delete-confirm-modal.tsx
│   │   ├── home-page.tsx         # Landing page content
│   │   ├── footer.tsx            # Footer component
│   │   ├── navigation.tsx        # Navigation bar
│   │   ├── theme-toggle.tsx      # Theme switcher
│   │   ├── PdfUploader.tsx       # Original uploader (standalone)
│   │   └── providers/
│   │       └── session-provider.tsx  # Session & theme providers
│   ├── lib/
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── prisma.ts            # Prisma client singleton
│   │   └── utils.ts             # Utility functions (cn, etc.)
│   ├── types/
│   │   ├── resume.ts            # Resume data type definitions
│   │   └── next-auth.d.ts      # NextAuth type extensions
│   └── utils/
│       ├── resumeTemplate.ts    # Empty resume template generator
│       └── resumeOrder.ts      # JSON field reordering utility
├── test-extract-api.ts          # API testing script
└── package.json
```

## 📜 Available Scripts

- `npm run dev` - Start development server (port 3002)
- `npm run build` - Build for production (includes Prisma generation)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test:api` - Test PDF extraction API endpoint
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## 💡 Usage Guide

### For End Users

1. **Visit Home Page**: Browse features and click "Try It Now"
2. **Sign Up**: Create an account with email and password (or sign in if you have one)
3. **Dashboard**: Access your personal dashboard with stats and file management
4. **Upload PDF**:
   - Drag and drop a PDF file or click to browse
   - Supports both text-based and image-based PDFs
   - Maximum file size: 10MB
5. **View Results**:
   - See processing status in real-time
   - View extracted data in a modal
   - Copy JSON data to clipboard
6. **File Management**:
   - View all uploaded files in history
   - Delete files when no longer needed
   - Track credits and processing stats

### For Developers

#### PDF Extraction API

**Direct Extraction** (no database save):

```bash
POST /api/extract
Content-Type: multipart/form-data
Body: file (PDF file)
```

**Upload & Save** (with database):

```bash
POST /api/files/upload
Content-Type: multipart/form-data
Headers: Cookie (session)
Body: file (PDF file)
```

#### File Management API

```bash
# List user files
GET /api/files

# Get file details & resume data
GET /api/files/[id]

# Delete file
DELETE /api/files/[id]

# Get user credits
GET /api/files/credits
```

## 🗄️ Database Schema

### Models

- **User**: User accounts with authentication credentials and credits

  - Fields: `id`, `email`, `name`, `password` (hashed), `credits`, `planType`, `createdAt`, etc.

- **File**: Uploaded PDF files metadata

  - Fields: `id`, `fileName`, `fileSize`, `fileType`, `status`, `uploadedAt`, `userId`, etc.
  - Status values: `uploaded`, `processing`, `completed`, `failed`

- **ResumeData**: Extracted resume data in JSON format

  - Fields: `id`, `userId`, `fileId`, `data` (JSON), `createdAt`, `updatedAt`
  - Structured JSON matching the ResumeData interface

- **ResumeHistory**: Complete audit trail of file operations

  - Fields: `id`, `userId`, `fileId`, `action`, `status`, `message`, `createdAt`
  - Actions: `upload`, `process`, `extract`, `delete`

- **Account, Session, VerificationToken**: NextAuth required models

### Relationships

- User → Files (one-to-many)
- File → ResumeData (one-to-one)
- User → ResumeData (one-to-many)
- User → ResumeHistory (one-to-many)
- File → ResumeHistory (one-to-many)

## 📊 Resume Data Schema

The extracted JSON follows this structure (in order):

```json
{
  "profile": {
    "name": "string",
    "surname": "string",
    "email": "string",
    "headline": "string",
    "professionalSummary": "string",
    "linkedIn": "string | null",
    "website": "string | null",
    "country": "string",
    "city": "string",
    "relocation": boolean,
    "remote": boolean
  },
  "workExperiences": [...],
  "educations": [...],
  "skills": [...],
  "licenses": [...],
  "languages": [...],
  "achievements": [...],
  "publications": [...],
  "honors": [...]
}
```

## 🔧 Configuration

### Credits System

- **New Users**: Start with 1000 credits
- **Cost per File**: 100 credits
- **Plan Types**: FREE (default), BASIC, PRO (for future implementation)

### File Processing

- **Text-Based PDFs**: Uses `gpt-4o-mini` for fast, cost-effective extraction
- **Image-Based PDFs**: Uses `gpt-4o` with Vision API for OCR
- **Auto-Detection**: Automatically detects PDF type and uses appropriate model
- **File Size Limit**: 10MB maximum
- **Supported Format**: PDF only

### Theme Settings

- Default theme: Dark
- Supports: Light, Dark, System (auto-detect)
- Preference saved in localStorage

## 🐛 Troubleshooting

### Common Issues

**"Unauthorized" Error**

- Make sure you're signed in
- Check that `NEXTAUTH_SECRET` is set correctly
- Verify session is valid

**"Insufficient credits" Error**

- Check your credits balance in the dashboard
- Each file costs 100 credits
- Contact admin to add more credits (for future implementation)

**"Failed to extract images" Error**

- Image-based PDF might be too large (>500KB base64)
- Try converting to text-based PDF
- Reduce image resolution or use smaller PDF

**Database Connection Error**

- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure database is accessible (firewall settings)

**Empty JSON Response**

- PDF might not contain extractable text
- Try a different PDF file
- Check OpenAI API key is valid
- Verify API quota is not exceeded

## 🧪 Testing

### Test PDF Extraction API

```bash
npm run test:api ./path/to/resume.pdf
```

### Test with cURL

```bash
# Test extraction endpoint
curl -X POST http://localhost:3002/api/extract \
  -F "file=@/path/to/resume.pdf"

# Test upload endpoint (requires authentication)
curl -X POST http://localhost:3002/api/files/upload \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -F "file=@/path/to/resume.pdf"
```

## 🚢 Deployment

### Environment Variables for Production

Make sure to set these in your production environment:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
OPENAI_API_KEY="your-openai-api-key"
```

### Build for Production

```bash
npm run build
npm run start
```

### Database Migrations in Production

```bash
# Apply migrations
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate
```

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For issues and questions:

- Open an issue on [GitHub](https://github.com/RustuKeten/AI-OCR-PDF-Extracter/issues)
- Check existing issues and documentation

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Supabase](https://supabase.com/)
- AI powered by [OpenAI](https://openai.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Made with ❤️ by [RustuKeten](https://github.com/RustuKeten)**
