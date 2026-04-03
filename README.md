# Resume Builder - Frontend

Ung dung tao CV/Resume duoc xay dung bang React + TypeScript + Vite + Ant Design.

## Yeu cau he thong

- **Node.js** >= 18 (khuyen nghi 20+)
- **npm** >= 9

Kiem tra phien ban da cai:

```bash
node -v
npm -v
```

Neu chua cai Node.js, tai tai: https://nodejs.org/

## Huong dan chay tu dau

### 1. Mo terminal va di chuyen vao thu muc du an

```bash
cd "C:\Users\Admin\Desktop\New folder (2)\resume-builder\FE"
```

### 2. Cai dat dependencies

```bash
npm install
```

Lenh nay se tai tat ca thu vien can thiet ve thu muc `node_modules/`.

### 3. Chay che do development

```bash
npm run dev
```

Sau khi chay, truy cap trinh duyet tai: **http://localhost:5173**

### 4. Build production

```bash
npm run build
```

Ket qua build se nam trong thu muc `dist/`.

### 5. Xem truoc ban build production

```bash
npm run preview
```

### 6. Kiem tra loi code (lint)

```bash
npm run lint
```

## Cau truc thu muc

```
FE/
├── public/            # Tai nguyen tinh (static assets)
├── src/
│   ├── components/    # Cac component dung chung
│   ├── pages/         # Cac trang chinh
│   │   ├── DashboardPage.tsx   # Trang quan ly CV
│   │   ├── EditorPage.tsx      # Trang chinh sua CV
│   │   └── ResumePreview.tsx   # Xem truoc CV
│   ├── stores/        # State management (Zustand)
│   ├── styles/        # File CSS/style
│   ├── utils/         # Ham tien ich
│   ├── App.tsx        # Component goc, dinh nghia routes
│   └── main.tsx       # Entry point
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Cong nghe su dung

| Thu vien           | Muc dich                  |
| ------------------ | ------------------------- |
| React 19           | UI framework              |
| TypeScript         | Type safety               |
| Vite 8             | Build tool & dev server   |
| Ant Design 6       | UI component library      |
| Zustand            | State management          |
| React Router DOM 7 | Routing                   |
| html2canvas-pro    | Chup anh CV               |
| jsPDF              | Xuat CV ra file PDF       |
| Axios              | HTTP client               |
| Lucide React       | Icon library              |
