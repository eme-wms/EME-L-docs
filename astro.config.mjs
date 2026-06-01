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
              items: [
                { label: "Сообщения и диалоги", link: "/language/basics/system-functions/messages/" },
                { label: "Окружение и информация о системе", link: "/language/basics/system-functions/environment/" },
                { label: "Управление выполнением и настройки", link: "/language/basics/system-functions/execution/" },
                { label: "Права доступа и пользователи", link: "/language/basics/system-functions/security/" },
                { label: "Филиалы и разделы", link: "/language/basics/system-functions/branches/" },
                { label: "Цвета", link: "/language/basics/system-functions/colors/" },
                { label: "Язык и локализация", link: "/language/basics/system-functions/localization/" },
                { label: "Криптография, реестр и взаимодействие", link: "/language/basics/system-functions/crypto-interop/" },
                { label: "Транзакции сервера и RPC", link: "/language/basics/system-functions/server/" },
                { label: "Внешние программы, версии и буфер обмена", link: "/language/basics/system-functions/external/" },
                { label: "База данных: структура, архивация и удаление", link: "/language/basics/system-functions/database/" },
                { label: "EANCOM (EDI-интеграция)", link: "/language/basics/system-functions/edi/" },
                { label: "Управление органами диалогов (GUI)", link: "/language/basics/system-functions/gui/" },
                { label: "Печать и PDF", link: "/language/basics/system-functions/print/" },
                { label: "Мониторинг и производительность", link: "/language/basics/system-functions/monitoring/" },
                { label: "Профилирование, отладка и прочее", link: "/language/basics/system-functions/debug/" },
              ],
            },
          ],
        },
        {
          label: "Язык EME-L — Данные",
          autogenerate: { directory: "language/data" },
        },
        {
          label: "Язык EME-L — Продвинутый",
          autogenerate: { directory: "language/advanced" },
        },
        {
          label: "Архитектура",
          autogenerate: { directory: "architecture" },
        },
        {
          label: "Администрирование",
          autogenerate: { directory: "administration" },
        },
        {
          label: "Интеграция",
          autogenerate: { directory: "integration" },
        },
        {
          label: "Сборка и DevOps",
          autogenerate: { directory: "build" },
        },
        {
          label: "GUI",
          autogenerate: { directory: "gui" },
        },
        {
          label: "ТСД и склад",
          autogenerate: { directory: "tsd" },
        },
        {
          label: "Платформа",
          autogenerate: { directory: "platform" },
        },
        {
          label: "Развёртывание",
          autogenerate: { directory: "deployment" },
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
