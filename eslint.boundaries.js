import boundaries from "eslint-plugin-boundaries";

export const eslintBoundariesConfig = {
  plugins: {
    boundaries,
  },
  settings: {
    // для работы абсолютных импортов через pathAlias
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },

    // разметка папок проекта по разным слоям из Evolution Design
    "boundaries/elements": [
      {
        type: "app",
        pattern: "./src/app",
      },
      {
        type: "features",
        pattern: "./src/features/*",
      },
      {
        type: "shared",
        pattern: "./src/shared",
      },
    ],
  },

  rules: {
    // определяем правила импорта между разными уровнями нашего проекта
    "boundaries/element-types": [
      2,
      {
        default: "allow",
        rules: [
          {
            from: "shared", // в shared теперь нельзя импортить модули из app и features
            disallow: ["app", "features"],
            message:
              "Модуль нижележащего слоя (${file.type}) не может импортировать модуль вышележащего слоя (${dependency.type})",
          },
          {
            from: "features", // в features теперь нельзя импортить модули из app
            disallow: ["app"],
            message:
              "Модуль нижележащего слоя (${file.type}) не может импортировать модуль вышележащего слоя (${dependency.type})",
          },
        ],
      },
    ],
    // ограничение на файлы, из которых можно импортировать переиспользуемый функционал
    "boundaries/entry-point": [
      2,
      {
        default: "disallow",
        message:
          "Модуль (${file.type}) должен импортироваться через public API. Прямой импорт из ${dependency.source} запрещен",

        rules: [
          {
            // из уровня shared и app можно импортировать произвольные файлы
            target: ["shared", "app"],
            allow: "**",
          },
          {
            // из уровня features можно импортировать только index.ts файлы
            // (типа это миниприложения, у которых может быть много внутренней логики о которой вызывающему коду знать не надо)
            // также добавляем возможность импортировать страничные компоненты независимо изнутри одного модуля
            target: ["features"],
            allow: ["index.(ts|tsx)", "*.page.tsx"],
          },
        ],
      },
    ],
  },
};
