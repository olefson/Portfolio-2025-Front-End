<<<<<<< HEAD
# Portfolio-2025-Front-End
Front end of a modernized portfolio.
=======
# Jason's Stack (Forkable)

A minimal, static site built with Next.js 15+ that documents my personal toolkit and processes. Fork this template to showcase your own stack and share:

- Tools you currently use or plan to try
- Your key processes and workflows
- Tools you plan to build
- Open suggestions for improvements

## Why Fork This?

- 🚀 **Ready to Use**: Built with Next.js 15+, TypeScript, and Tailwind CSS
- 📝 **Easy to Customize**: Simple markdown-based content management
- 🎨 **Beautiful UI**: Dark mode support and modern design with shadcn/ui
- 📱 **Responsive**: Looks great on all devices
- 🔄 **Future-Ready**: Structured for potential dynamic features

## 🚀 Quick Start

1. Fork this repository
2. Clone your fork:
```bash
git clone https://github.com/olefson/stack.git
cd stack
```

3. Install dependencies:
```bash
npm install
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to see your site.

6. Start customizing by updating the content in `src/content/`!

## 📝 Customizing Content

### Tools

1. Navigate to `src/content/tools/`
2. Create markdown files for your tools using this format:

```markdown
---
title: "Tool Name"
status: "Using" | "Plan to Try" | "Plan to Build" | "Building" | "Retired"
category: "AI" | "Productivity" | "Development" | "Communication" | "Design" | "Other"
description: "Brief description of the tool"
howToUse: "- Key use case 1\n- Key use case 2\n- Key use case 3"
caveats: "Optional notes about limitations"
url: "https://tool-url.com/"
---

Detailed description of the tool goes here.

## Key Features

1. **Feature Category 1**
   - Feature point
   - Feature point
   - Feature point

2. **Feature Category 2**
   - Feature point
   - Feature point
   - Feature point

## Best Practices

- Practice 1
- Practice 2
- Practice 3
```

### Processes

1. Navigate to `src/content/processes/`
2. Create markdown files for your processes using this format:

```markdown
---
title: "Process Name"
category: "Personal" | "Professional" | "Development" | "Content" | "Other"
description: "Brief description of the process"
toolsInvolved: ["Tool 1", "Tool 2", "Tool 3"]
steps: [
  "Step 1 description",
  "Step 2 description",
  "Step 3 description"
]
notes: "Optional additional notes"
---

Detailed description of the process goes here.

## Key Components

1. **Component 1**
   - Detail
   - Detail
   - Detail

2. **Component 2**
   - Detail
   - Detail
   - Detail

## Best Practices

- Practice 1
- Practice 2
- Practice 3
```

## 🎨 Customizing Style

1. Update site configuration in `src/config/site.ts`
2. Modify theme colors in `tailwind.config.js`
3. Update global styles in `src/app/globals.css`

## 🏗️ Project Structure

```
stack/
├─ src/
│  ├─ app/                    # Next.js 15+ App Router pages
│  ├─ components/             # React components
│  ├─ config/                 # Site configuration
│  ├─ content/               
│  │  ├─ tools/              # Tool markdown files
│  │  └─ processes/          # Process markdown files
│  ├─ lib/                    # Utility functions
│  └─ types/                 # TypeScript types
├─ public/
│  └─ images/                # Static assets and tool logos
└─ tailwind.config.js        # Tailwind configuration
```

## 🛠️ Built With

- [Next.js 15+](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Markdown processing
- [react-markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspired by modern documentation sites
- Built with Next.js App Router and Tailwind CSS
- UI components from shadcn/ui
>>>>>>> e7ce1cc (Initial commit: Front-End setup)
