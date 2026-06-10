import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://eme-wms.com",
  integrations: [
    sitemap(),
    starlight({
      title: {
        ru: "EME-L",
        en: "EME-L",
      },
      defaultLocale: "root",
      locales: {
        root: {
          label: "Русский",
          lang: "ru",
        },
        en: {
          label: "English",
          lang: "en",
        },
      },
      logo: {
        src: "./src/assets/logo.svg",
      },
      favicon: "/favicon.svg",
      customCss: ["./src/styles/custom.css"],
      components: {
        ThemeSelect: "./src/components/ThemeSelect.astro",
      },
      sidebar: [
        {
          label: "Начало",
          link: "/",
        },
        {
          label: "Язык EME-L — Основы",
          items: [
            { label: "Синтаксис", link: "/language/basics/syntax/" },
            { label: "Классы и объекты", link: "/language/basics/classes/" },
            { label: "События", link: "/language/basics/events/" },
            { label: "Константы", link: "/language/basics/constants/" },
            { label: "IS-функции", link: "/language/basics/is-functions/" },
            {
              label: "Системные функции",
              collapsed: true,
              items: [{ autogenerate: { directory: "language/basics/system-functions" } }],
            },
          ],
        },
        {
          label: "Язык EME-L — Данные",
          items: [{ autogenerate: { directory: "language/data" } }],
        },
        {
          label: "Язык EME-L — Продвинутый",
          items: [{ autogenerate: { directory: "language/advanced" } }],
        },
        {
          label: "Архитектура",
          items: [{ autogenerate: { directory: "architecture" } }],
        },
        {
          label: "Администрирование",
          items: [{ autogenerate: { directory: "administration" } }],
        },
        {
          label: "Интеграция",
          items: [{ autogenerate: { directory: "integration" } }],
        },
        {
          label: "Сборка и DevOps",
          items: [{ autogenerate: { directory: "build" } }],
        },
        {
          label: "GUI",
          items: [{ autogenerate: { directory: "gui" } }],
        },
        {
          label: "ТСД и склад",
          items: [{ autogenerate: { directory: "tsd" } }],
        },
        {
          label: "Платформа",
          items: [{ autogenerate: { directory: "platform" } }],
        },
        {
          label: "Тестирование",
          items: [{ autogenerate: { directory: "testing" } }],
        },
        {
          label: "Развёртывание",
          items: [{ autogenerate: { directory: "deployment" } }],
        },
      ],
      head: [
        {
          tag: "meta",
          attrs: {
            name: "description",
            content:
              "Документация языка программирования EME-L и системы управления складом EME.WMS",
          },
        },
      ],
    }),
  ],
});
