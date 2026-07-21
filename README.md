# Skill2Success Certifications Platform 🎓

A modern, full-stack Next.js web application for securely issuing, managing, and verifying digital certificates for Skill2Success students.

## ✨ Features

- **🎓 Student Portal**: A dedicated dashboard where students can view their awarded certificates, download them as high-quality PDFs, and directly share their credentials to their LinkedIn profile.
- **🛡️ Secure Verification**: Cryptographically secure certificate generation. Each certificate gets a unique `credentialId` and SHA-256 hash, ensuring authenticity. Anyone can verify a certificate's validity using its unique link.
- **🎨 Drag-and-Drop Template Builder**: Admins can upload background templates and use a visual drag-and-drop editor to place text fields (Student Name, Course, Issue Date, etc.) exactly where they want them.
- **📄 Batch Issuance (Excel to ZIP)**: Issue hundreds of certificates at once! Admins can upload an Excel/CSV file containing student data. The system will automatically generate all certificates using the selected template and bundle them into a downloadable ZIP file.
- **🔐 Admin Dashboard**: A comprehensive dashboard to track all issued certificates, view system metrics, and manage templates.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: PostgreSQL (via Supabase)
- **ORM**: [Prisma](https://www.prisma.io/)
- **PDF Generation**: `jspdf` & `html2canvas`
- **UI Components**: custom-built with `lucide-react` icons and Framer Motion for animations.

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Create a `.env` file in the root directory and add your Supabase database URL:
```env
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

### 3. Setup the Database
Push the Prisma schema to your database:
```bash
npx prisma db push
npx prisma generate
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `src/app/admin/`: Admin portal, template builder, and batch issuance tools.
- `src/app/student/`: Student-facing dashboard and certificate preview.
- `src/app/verify/`: Public-facing certificate verification pages.
- `src/components/`: Reusable React components (like the TemplateBuilder, PDFGenerator, etc.).

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
