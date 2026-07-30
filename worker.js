import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const SUPER_ADMINS = [
  738795572
];

const SECTIONS = [
  ["general", "1. Основная информация"],
  ["personal", "2. Персональные данные"],
  ["passport", "3. Документ, удостоверяющий личность"],
  ["property", "4. Параметры желаемого объекта"],
  ["budget", "5. Бюджет покупки"],
  ["financial", "6. Финансовая готовность"],
  ["legal", "7. Юридические аспекты"],
  ["timing", "8. Сроки и условия сделки"],
  ["consent", "9. Согласие на проверку и обработку данных"]
];

const QUESTIONS = {
  general: [
    textQ("object", "Объект"),
    textQ("object_address", "Адрес объекта"),
    textQ("filled_date", "Дата заполнения"),
    textQ("agency_specialist", "ФИО специалиста агентства")
  ],

  personal: [
    textQ("full_name", "ФИО полностью"),
    textQ("birth_date", "Дата рождения"),
    textQ("citizenship", "Гражданство"),
    textQ("birth_place", "Место рождения"),
    textQ("phone", "Телефон"),
    textQ("email", "Email"),
    textQ("registration_address", "Адрес регистрации"),
    textQ("actual_address", "Фактический адрес проживания")
  ],

  passport: [
    textQ("passport_series", "Серия паспорта"),
    textQ("passport_number", "Номер паспорта"),
    textQ("passport_issued_by", "Кем выдан"),
    textQ("passport_issue_date", "Дата выдачи"),
    textQ("passport_department_code", "Код подразделения")
  ],

  property: [
    singleQ(
      "property_type",
      "Тип недвижимости",
      [
        "Квартира",
        "Дом / коттедж",
        "Таунхаус",
        "Коммерческое помещение",
        "Земельный участок",
        "Другое"
      ]
    ),

    singleQ(
      "rooms",
      "Количество комнат",
      [
        "Студия",
        "1",
        "2",
        "3",
        "4+"
      ]
    ),

    textQ("area_from", "Диапазон площади: от, м²"),
    textQ("area_to", "Диапазон площади: до, м²"),

    singleQ(
      "preferred_floor",
      "Желаемый этаж",
      [
        "Не имеет значения",
        "Не выше определённого этажа",
        "Первый",
        "Последний",
        "Не первый и не последний"
      ]
    ),

    textQ("max_floor", "Не выше какого этажа"),

    singleQ(
      "building_type",
      "Тип дома",
      [
        "Кирпичный",
        "Панельный",
        "Монолитный",
        "Деревянный",
        "Не имеет значения"
      ]
    ),

    singleQ(
      "elevator",
      "Наличие лифта",
      [
        "Не важно",
        "Обязательно",
        "Желательно"
      ]
    ),

    singleQ(
      "parking",
      "Наличие парковки",
      [
        "Не важно",
        "Гостевая",
        "Подземная",
        "Собственное машино-место"
      ]
    ),

    singleQ(
      "condition",
      "Состояние объекта",
      [
        "Без отделки",
        "Черновая отделка",
        "Косметический ремонт",
        "Дизайнерский ремонт"
      ]
    ),

    textQ(
      "location",
      "Желаемая локация — район / метро"
    ),

    textQ(
      "requirements",
      "Дополнительные требования: балкон, гардеробная, кладовая, охрана, двор без машин и т. д."
    )
  ],

  budget: [
    textQ(
      "desired_budget",
      "Желаемый бюджет покупки, ₽"
    ),

    textQ(
      "max_price",
      "Максимальная цена, ₽"
    ),

    textQ(
      "min_price",
      "Минимальная цена, ₽"
    ),

    textQ(
      "own_funds",
      "Наличие собственных средств, ₽"
    ),

    singleQ(
      "mortgage",
      "Планируется ли ипотека",
      [
        "Нет",
        "Да"
      ]
    ),

    textQ(
      "mortgage_amount",
      "Сумма ипотечного кредита, ₽"
    ),

    singleQ(
      "bank_approval",
      "Есть ли одобрение банка",
      [
        "Нет",
        "Да"
      ]
    ),

    textQ(
      "bank_name",
      "Банк"
    ),

    textQ(
      "approved_amount",
      "Одобренная сумма, ₽"
    ),

    multiQ(
      "fund_sources",
      "Планируемый источник средств для покупки",
      [
        "Собственные накопления",
        "Продажа имеющейся недвижимости",
        "Ипотечный кредит",
        "Материнский капитал",
        "Заём от родственников / друзей",
        "Иное"
      ]
    ),

    textQ(
      "other_fund_source",
      "Иной источник средств"
    )
  ],

  financial: [
    singleQ(
      "deposit_ready",
      "Готовность внести задаток при подписании предварительного договора",
      [
        "Да",
        "Нет",
        "Готов обсуждать"
      ]
    ),

    textQ(
      "full_payment_date",
      "Планируемая дата полного расчёта"
    ),

    singleQ(
      "current_loans",
      "Есть ли текущие кредитные обязательства",
      [
        "Нет",
        "Да"
      ]
    ),

    textQ(
      "monthly_loan_payment",
      "Сумма ежемесячного платежа, ₽"
    )
  ],

  legal: [
    singleQ(
      "documents_ready",
      "Готовы ли предоставить документы для проверки платёжеспособности",
      [
        "Да",
        "Нет"
      ]
    ),

    multiQ(
      "documents",
      "Какие документы готовы предоставить",
      [
        "Паспорт",
        "Справка 2-НДФЛ",
        "Выписка по счёту",
        "Ипотечное одобрение",
        "Трудовой договор",
        "Документы о продаже имущества",
        "Иное"
      ]
    ),

    textQ(
      "other_document",
      "Иной документ"
    )
  ],

  timing: [
    textQ(
      "desired_registration_date",
      "Желаемая дата заезда / регистрации права"
    )
  ],

  consent: [
    textQ(
      "buyer_name",
      "ФИО покупателя"
    ),

    singleQ(
      "data_consent",
      "Согласие на проверку и обработку данных",
      [
        "Согласен(на)",
        "Не согласен(на)"
      ]
    ),

    textQ(
      "consent_date",
      "Дата согласия"
    ),

    textQ(
      "buyer_signature",
      "Подпись покупателя — ФИО"
    )
  ]
};

function textQ(id, title) {
  return {
    id,
    title,
    type: "text"
  };
}

function singleQ(id, title, options) {
  return {
    id,
    title,
    type: "single",
    options
  };
}

function multiQ(id, title, options) {
  return {
    id,
    title,
    type: "multi",
    options
  };
}

export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("Buyer questionnaire bot is running");
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const update = await request.json();

      if (update.message) {
        await handleMessage(update.message, env);
      }

      if (update.callback_query) {
        await handleCallback(update.callback_query, env);
      }

      return new Response("ok");
} catch (error) {
  const errorName =
    error instanceof Error
      ? error.name
      : "UnknownError";

  const errorMessage =
    error instanceof Error
      ? error.message
      : String(error);

  const errorStack =
    error instanceof Error
      ? error.stack
      : "";

  console.error(
    `BOT_ERROR_NAME: ${errorName}\n` +
    `BOT_ERROR_MESSAGE: ${errorMessage}\n` +
    `BOT_ERROR_STACK: ${errorStack}`
  );

  return new Response("ok");
}
  }
};

async function handleMessage(message, env) {
  const chatId = message.chat.id;
  const text = String(message.text || "").trim();

  if (text.startsWith("/start")) {
    await clearState(env, chatId);

    const broker = await getCurrentBroker(env, chatId);
    const admin = await isAdmin(env, chatId);

    if (!broker && !admin) {
      return sendBrokerLinkMenu(env, chatId);
    }

    return sendMainMenu(env.BOT_TOKEN, chatId);
  }

  const state = await getState(env, chatId);

  if (state?.state === "waiting_title") {
    if (!text) {
      return sendMessage(
        env.BOT_TOKEN,
        chatId,
        "Введите название анкеты сообщением."
      );
    }

    await updateFormTitle(env, state.formId, text);
    await clearState(env, chatId);

    return sendFormMenu(
      env,
      chatId,
      state.formId
    );
  }

  if (state?.state === "waiting_answer") {
    const question = getQuestion(
      state.sectionId,
      state.questionId
    );

    if (!question) {
      await clearState(env, chatId);

      return sendMessage(
        env.BOT_TOKEN,
        chatId,
        "Вопрос не найден. Нажмите /start."
      );
    }

    await saveAnswer(
      env,
      state.formId,
      state.sectionId,
      state.questionId,
      question.title,
      text
    );

    await clearState(env, chatId);

    return sendSectionMenu(
      env,
      chatId,
      state.formId,
      state.sectionId
    );
  }

  return sendMessage(
    env.BOT_TOKEN,
    chatId,
    "Нажмите /start"
  );
}

async function handleCallback(callback, env) {
  const chatId = callback.message.chat.id;
  const data = callback.data;

  await answerCallback(
    env.BOT_TOKEN,
    callback.id
  );

  if (data === "main_menu") {
    await clearState(env, chatId);

    return sendMainMenu(
      env.BOT_TOKEN,
      chatId
    );
  }

  if (data === "create_form") {
    let broker = await getCurrentBroker(
      env,
      chatId
    );

    if (
      !broker &&
      SUPER_ADMINS.includes(Number(chatId))
    ) {
      broker = {
        id: "admin",
        name: "Тест"
      };
    }

    if (!broker) {
      return sendBrokerLinkMenu(
        env,
        chatId
      );
    }
 
    const form = await createForm(
      env,
      chatId,
      broker
    );

    await setState(
      env,
      chatId,
      "waiting_title",
      form.number,
      "",
      ""
    );

    return sendMessage(
      env.BOT_TOKEN,
      chatId,
      `✅ Анкета создана

${form.number}
Специалист: ${broker.name}

Введите название анкеты сообщением.
Например: Иванов Иван — покупка квартиры`
    );
  }

  if (data.startsWith("link_broker:")) {
    const brokerId = data.split(":")[1];

    const result =
      await assignTelegramIdToBroker(
        env,
        brokerId,
        chatId
      );

    if (!result.ok) {
      return sendMessage(
        env.BOT_TOKEN,
        chatId,
        result.message
      );
    }

    await sendMessage(
      env.BOT_TOKEN,
      chatId,
      "Готово ✅\nТеперь бот будет узнавать вас автоматически."
    );

    return sendMainMenu(
      env.BOT_TOKEN,
      chatId
    );
  }

  if (data === "my_forms") {
    const forms = await getForms(
      env,
      chatId
    );

    if (!forms.length) {
      return sendMessage(
        env.BOT_TOKEN,
        chatId,
        "У вас пока нет анкет."
      );
    }

    const keyboard = forms.map(form => [
      {
        text: `${form.number} — ${form.broker} — ${form.title}`,
        callback_data: `form_menu:${form.number}`
      }
    ]);

    keyboard.push([
      {
        text: "Назад",
        callback_data: "main_menu"
      }
    ]);

    return sendMessage(
      env.BOT_TOKEN,
      chatId,
      "Ваши анкеты:",
      {
        inline_keyboard: keyboard
      }
    );
  }

  if (data.startsWith("form_menu:")) {
    const formId = data.split(":")[1];

    if (
      !(await canAccessForm(
        env,
        chatId,
        formId
      ))
    ) {
      return sendMessage(
        env.BOT_TOKEN,
        chatId,
        "❌ У вас нет доступа к этой анкете."
      );
    }

    return sendFormMenu(
      env,
      chatId,
      formId
    );
  }

  if (data.startsWith("section:")) {
    const [, formId, sectionId] =
      data.split(":");

    if (
      !(await canAccessForm(
        env,
        chatId,
        formId
      ))
    ) {
      return sendMessage(
        env.BOT_TOKEN,
        chatId,
        "❌ У вас нет доступа к этой анкете."
      );
    }

    return sendSectionMenu(
      env,
      chatId,
      formId,
      sectionId
    );
  }

  if (data.startsWith("q:")) {
    const [
      ,
      formId,
      sectionId,
      questionId
    ] = data.split(":");

    if (
      !(await canAccessForm(
        env,
        chatId,
        formId
      ))
    ) {
      return sendMessage(
        env.BOT_TOKEN,
        chatId,
        "❌ У вас нет доступа к этой анкете."
      );
    }

    return openQuestion(
      env,
      chatId,
      formId,
      sectionId,
      questionId
    );
  }

  if (data.startsWith("a:")) {
    const [
      ,
      formId,
      sectionId,
      questionId,
      optionIndex
    ] = data.split(":");

    if (
      !(await canAccessForm(
        env,
        chatId,
        formId
      ))
    ) {
      return sendMessage(
        env.BOT_TOKEN,
        chatId,
        "❌ У вас нет доступа к этой анкете."
      );
    }

    const question = getQuestion(
      sectionId,
      questionId
    );

    const answer =
      question.options[
        Number(optionIndex)
      ];

    await saveAnswer(
      env,
      formId,
      sectionId,
      questionId,
      question.title,
      answer
    );

    return sendSectionMenu(
      env,
      chatId,
      formId,
      sectionId
    );
  }

  if (data.startsWith("m:")) {
    const [
      ,
      formId,
      sectionId,
      questionId,
      optionIndex
    ] = data.split(":");

    if (
      !(await canAccessForm(
        env,
        chatId,
        formId
      ))
    ) {
      return sendMessage(
        env.BOT_TOKEN,
        chatId,
        "❌ У вас нет доступа к этой анкете."
      );
    }

    const question = getQuestion(
      sectionId,
      questionId
    );

    const option =
      question.options[
        Number(optionIndex)
      ];

    const answers = await getAnswers(
      env,
      formId
    );

    const key =
      `${sectionId}:${questionId}`;

    const current = answers[key]
      ? answers[key]
          .split(", ")
          .filter(Boolean)
      : [];

    const updated =
      current.includes(option)
        ? current.filter(
            item => item !== option
          )
        : [...current, option];

    await saveAnswer(
      env,
      formId,
      sectionId,
      questionId,
      question.title,
      updated.join(", ")
    );

    return openQuestion(
      env,
      chatId,
      formId,
      sectionId,
      questionId
    );
  }

  if (data.startsWith("pdf:")) {
    const formId = data.split(":")[1];

    if (
      !(await canAccessForm(
        env,
        chatId,
        formId
      ))
    ) {
      return sendMessage(
        env.BOT_TOKEN,
        chatId,
        "❌ У вас нет доступа к этой анкете."
      );
    }

    await sendMessage(
      env.BOT_TOKEN,
      chatId,
      "Формирую PDF..."
    );

    try {
      const form = await getForm(
        env,
        formId
      );

      const pdfBuffer =
        await generatePdf(
          env,
          formId
        );

      const fileName =
        `${formId} - ${sanitizeFileName(form.title)}.pdf`;

      await sendPdf(
        env.BOT_TOKEN,
        chatId,
        pdfBuffer,
        fileName
      );
    } catch (error) {
      await sendMessage(
        env.BOT_TOKEN,
        chatId,
        `Ошибка PDF:\n${error.message}`
      );
    }

    return;
  }
}

async function sendMainMenu(token, chatId) {
  return sendMessage(
    token,
    chatId,
    "Главное меню",
    {
      inline_keyboard: [
        [
          {
            text: "Создать анкету",
            callback_data: "create_form"
          }
        ],
        [
          {
            text: "Мои анкеты",
            callback_data: "my_forms"
          }
        ]
      ]
    }
  );
}

async function sendBrokerLinkMenu(env, chatId) {
  const brokers = await getBrokers(env);

  const availableBrokers = brokers.filter(
    broker => !broker.telegramId
  );

  if (!availableBrokers.length) {
    return sendMessage(
      env.BOT_TOKEN,
      chatId,
      "Свободный профиль сотрудника не найден. Обратитесь к администратору."
    );
  }

  const keyboard = availableBrokers.map(
    broker => [
      {
        text: broker.name,
        callback_data: `link_broker:${broker.id}`
      }
    ]
  );

  return sendMessage(
    env.BOT_TOKEN,
    chatId,
    "Выберите себя из списка:",
    {
      inline_keyboard: keyboard
    }
  );
}

async function sendFormMenu(
  env,
  chatId,
  formId
) {
  const form = await getForm(
    env,
    formId
  );

  if (!form) {
    return sendMessage(
      env.BOT_TOKEN,
      chatId,
      "Анкета не найдена."
    );
  }

  const answers = await getAnswers(
    env,
    formId
  );

  let totalQuestions = 0;
  let totalAnswered = 0;

  const keyboard = SECTIONS.map(
    ([sectionId, sectionTitle]) => {
      const questions =
        QUESTIONS[sectionId] || [];

      const answeredCount =
        questions.filter(
          question =>
            Boolean(
              answers[
                `${sectionId}:${question.id}`
              ]
            )
        ).length;

      totalQuestions +=
        questions.length;

      totalAnswered +=
        answeredCount;

      let prefix = "⚪";

      if (
        questions.length > 0 &&
        answeredCount === questions.length
      ) {
        prefix = "🟢";
      } else if (
        answeredCount > 0
      ) {
        prefix = "🟡";
      }

      return [
        {
          text:
            `${prefix} ${sectionTitle} ` +
            `(${answeredCount}/${questions.length})`,
          callback_data:
            `section:${formId}:${sectionId}`
        }
      ];
    }
  );

  keyboard.push([
    {
      text: "Сформировать PDF",
      callback_data: `pdf:${formId}`
    }
  ]);

  keyboard.push([
    {
      text: "Мои анкеты",
      callback_data: "my_forms"
    }
  ]);

  keyboard.push([
    {
      text: "Главное меню",
      callback_data: "main_menu"
    }
  ]);

  let message =
`${form.number}
Название: ${form.title}
Специалист: ${form.broker}

Выберите раздел:`;

  if (
    totalQuestions > 0 &&
    totalAnswered === totalQuestions
  ) {
    message =
`✅ Анкета заполнена полностью!

Не забудьте сформировать и сохранить PDF.

${form.number}
Название: ${form.title}
Специалист: ${form.broker}

Выберите действие:`;
  }

  return sendMessage(
    env.BOT_TOKEN,
    chatId,
    message,
    {
      inline_keyboard: keyboard
    }
  );
}

async function sendSectionMenu(
  env,
  chatId,
  formId,
  sectionId
) {
  const section = SECTIONS.find(
    item => item[0] === sectionId
  );

  const questions =
    QUESTIONS[sectionId] || [];

  const answers = await getAnswers(
    env,
    formId
  );

  const keyboard = questions.map(
    question => {
      const done =
        answers[
          `${sectionId}:${question.id}`
        ]
          ? " ✅"
          : "";

      return [
        {
          text: question.title + done,
          callback_data:
            `q:${formId}:${sectionId}:${question.id}`
        }
      ];
    }
  );

  keyboard.push([
    {
      text: "Назад к анкете",
      callback_data:
        `form_menu:${formId}`
    }
  ]);

  keyboard.push([
    {
      text: "Главное меню",
      callback_data: "main_menu"
    }
  ]);

  return sendMessage(
    env.BOT_TOKEN,
    chatId,
    `${section?.[1] || "Раздел"}

Выберите вопрос:`,
    {
      inline_keyboard: keyboard
    }
  );
}

async function openQuestion(
  env,
  chatId,
  formId,
  sectionId,
  questionId
) {
  const question = getQuestion(
    sectionId,
    questionId
  );

  if (!question) {
    return sendMessage(
      env.BOT_TOKEN,
      chatId,
      "Вопрос не найден."
    );
  }

  if (question.type === "text") {
    await setState(
      env,
      chatId,
      "waiting_answer",
      formId,
      sectionId,
      questionId
    );

    return sendMessage(
      env.BOT_TOKEN,
      chatId,
      `${question.title}

Введите значение сообщением:`
    );
  }

  if (question.type === "single") {
    const keyboard =
      question.options.map(
        (option, index) => [
          {
            text: option,
            callback_data:
              `a:${formId}:${sectionId}:${questionId}:${index}`
          }
        ]
      );

    keyboard.push([
      {
        text: "Назад",
        callback_data:
          `section:${formId}:${sectionId}`
      }
    ]);

    return sendMessage(
      env.BOT_TOKEN,
      chatId,
      `${question.title}

Выберите один вариант:`,
      {
        inline_keyboard: keyboard
      }
    );
  }

  if (question.type === "multi") {
    const answers = await getAnswers(
      env,
      formId
    );

    const current =
      answers[
        `${sectionId}:${questionId}`
      ]
        ? answers[
            `${sectionId}:${questionId}`
          ]
            .split(", ")
            .filter(Boolean)
        : [];

    const keyboard =
      question.options.map(
        (option, index) => {
          const checked =
            current.includes(option)
              ? "✅ "
              : "";

          return [
            {
              text: checked + option,
              callback_data:
                `m:${formId}:${sectionId}:${questionId}:${index}`
            }
          ];
        }
      );

    keyboard.push([
      {
        text: "Готово",
        callback_data:
          `section:${formId}:${sectionId}`
      }
    ]);

    keyboard.push([
      {
        text: "Назад",
        callback_data:
          `section:${formId}:${sectionId}`
      }
    ]);

    return sendMessage(
      env.BOT_TOKEN,
      chatId,
      `${question.title}

Выберите один или несколько вариантов:`,
      {
        inline_keyboard: keyboard
      }
    );
  }
}

function getQuestion(
  sectionId,
  questionId
) {
  return (
    QUESTIONS[sectionId] || []
  ).find(
    question =>
      question.id === questionId
  );
}

async function createForm(
  env,
  chatId,
  broker
) {
  const token = await getAccessToken(env);

  const number =
    await getNextFormNumber(
      env,
      token
    );

  const now =
    new Date().toISOString();

  await appendRow(
    env,
    token,
    "forms!A:G",
    [
      number,
      String(chatId),
      broker.id,
      broker.name,
      "Без названия",
      now,
      now
    ]
  );

  return {
    number
  };
}

async function updateFormTitle(
  env,
  formId,
  title
) {
  const token =
    await getAccessToken(env);

  const rows =
    await getValues(
      env,
      token,
      "forms!A2:G"
    );

  const index =
    rows.findIndex(
      row => row[0] === formId
    );

  if (index === -1) {
    return;
  }

  const rowNumber =
    index + 2;

  await updateValues(
    env,
    token,
    `forms!E${rowNumber}:G${rowNumber}`,
    [
      [
        title,
        rows[index][5],
        new Date().toISOString()
      ]
    ]
  );
}

async function getForms(
  env,
  chatId
) {
  const token =
    await getAccessToken(env);

  const rows =
    await getValues(
      env,
      token,
      "forms!A2:G"
    );

  const admin =
    await isAdmin(
      env,
      chatId
    );

  return rows
    .filter(
      row =>
        admin ||
        String(row[1]) ===
          String(chatId)
    )
    .map(
      row => ({
        number: row[0],
        broker: row[3],
        title: row[4]
      })
    );
}

async function getForm(
  env,
  formId
) {
  const token =
    await getAccessToken(env);

  const rows =
    await getValues(
      env,
      token,
      "forms!A2:G"
    );

  const row =
    rows.find(
      item =>
        item[0] === formId
    );

  if (!row) {
    return null;
  }

  return {
    number: row[0],
    telegramId: row[1],
    brokerId: row[2],
    broker: row[3],
    title: row[4],
    createdAt: row[5],
    updatedAt: row[6]
  };
}

async function canAccessForm(
  env,
  chatId,
  formId
) {
  if (
    await isAdmin(
      env,
      chatId
    )
  ) {
    return true;
  }

  const form =
    await getForm(
      env,
      formId
    );

  return Boolean(
    form &&
    String(form.telegramId) ===
      String(chatId)
  );
}

async function saveAnswer(
  env,
  formId,
  sectionId,
  questionId,
  questionTitle,
  answerValue
) {
  const token =
    await getAccessToken(env);

  const rows =
    await getValues(
      env,
      token,
      "answers!A2:F"
    );

  const index =
    rows.findIndex(
      row =>
        row[0] === formId &&
        row[1] === sectionId &&
        row[2] === questionId
    );

  const values = [
    [
      formId,
      sectionId,
      questionId,
      questionTitle,
      answerValue,
      new Date().toISOString()
    ]
  ];

  if (index === -1) {
    await appendRow(
      env,
      token,
      "answers!A:F",
      values[0]
    );
  } else {
    await updateValues(
      env,
      token,
      `answers!A${index + 2}:F${index + 2}`,
      values
    );
  }
}

async function getAnswers(
  env,
  formId
) {
  const token =
    await getAccessToken(env);

  const rows =
    await getValues(
      env,
      token,
      "answers!A2:F"
    );

  const result = {};

  rows
    .filter(
      row =>
        row[0] === formId
    )
    .forEach(
      row => {
        result[
          `${row[1]}:${row[2]}`
        ] = row[4];
      }
    );

  return result;
}

async function setState(
  env,
  chatId,
  state,
  formId,
  sectionId,
  questionId
) {
  const token =
    await getAccessToken(env);

  const rows =
    await getValues(
      env,
      token,
      "states!A2:E"
    );

  const index =
    rows.findIndex(
      row =>
        String(row[0]) ===
        String(chatId)
    );

  const values = [
    [
      String(chatId),
      state,
      formId,
      sectionId,
      questionId
    ]
  ];

  if (index === -1) {
    await appendRow(
      env,
      token,
      "states!A:E",
      values[0]
    );
  } else {
    await updateValues(
      env,
      token,
      `states!A${index + 2}:E${index + 2}`,
      values
    );
  }
}

async function getState(
  env,
  chatId
) {
  const token =
    await getAccessToken(env);

  const rows =
    await getValues(
      env,
      token,
      "states!A2:E"
    );

  const row =
    rows.find(
      item =>
        String(item[0]) ===
        String(chatId)
    );

  if (
    !row ||
    !row[1]
  ) {
    return null;
  }

  return {
    state: row[1],
    formId: row[2],
    sectionId: row[3],
    questionId: row[4]
  };
}

async function clearState(
  env,
  chatId
) {
  return setState(
    env,
    chatId,
    "",
    "",
    "",
    ""
  );
}

async function getNextFormNumber(
  env,
  token
) {
  const rows =
    await getValues(
      env,
      token,
      "forms!A2:A"
    );

  let max = 0;

  for (const row of rows) {
    const match =
      String(
        row[0] || ""
      ).match(
        /^BUY-(\d+)$/
      );

    if (match) {
      max = Math.max(
        max,
        Number(match[1])
      );
    }
  }

  return (
    `BUY-${String(max + 1)
      .padStart(6, "0")}`
  );
}

async function getBrokers(env) {
  const token =
    await getAccessToken(env);

  const rows =
    await getValues(
      env,
      token,
      "brokers!A2:E"
    );

  return rows
    .filter(
      row =>
        String(row[3])
          .toUpperCase() ===
        "TRUE"
    )
    .map(
      row => ({
        id: row[0],
        name: row[1],
        telegramId:
          String(
            row[2] || ""
          ).trim(),
        admin:
          String(row[4])
            .toUpperCase() ===
          "TRUE"
      })
    );
}

async function getCurrentBroker(
  env,
  chatId
) {
  const brokers =
    await getBrokers(env);

  return (
    brokers.find(
      broker =>
        String(
          broker.telegramId
        ) ===
        String(chatId)
    ) || null
  );
}

async function isAdmin(
  env,
  chatId
) {
  if (
    SUPER_ADMINS.includes(
      Number(chatId)
    )
  ) {
    return true;
  }

  const broker =
    await getCurrentBroker(
      env,
      chatId
    );

  return (
    broker?.admin === true
  );
}

async function assignTelegramIdToBroker(
  env,
  brokerId,
  chatId
) {
  const token =
    await getAccessToken(env);

  const rows =
    await getValues(
      env,
      token,
      "brokers!A2:E"
    );

  const index =
    rows.findIndex(
      row =>
        row[0] === brokerId
    );

  if (index === -1) {
    return {
      ok: false,
      message:
        "Профиль сотрудника не найден."
    };
  }

  if (
    String(
      rows[index][2] || ""
    ).trim()
  ) {
    return {
      ok: false,
      message:
        "Этот профиль уже привязан к Telegram."
    };
  }

  const alreadyLinked =
    rows.some(
      row =>
        String(
          row[2] || ""
        ).trim() ===
        String(chatId)
    );

  if (alreadyLinked) {
    return {
      ok: false,
      message:
        "Ваш Telegram уже привязан к другому профилю."
    };
  }

  await updateValues(
    env,
    token,
    `brokers!C${index + 2}`,
    [
      [
        String(chatId)
      ]
    ]
  );

  return {
    ok: true
  };
}

async function getValues(
  env,
  token,
  range
) {
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${env.SPREADSHEET_ID}` +
    `/values/${encodeURIComponent(range)}`;

  const response = await fetch(
    url,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      "Ошибка чтения Google Sheets:\n" +
      await response.text()
    );
  }

  const data =
    await response.json();

  return data.values || [];
}

async function appendRow(
  env,
  token,
  range,
  row
) {
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${env.SPREADSHEET_ID}` +
    `/values/${encodeURIComponent(range)}` +
    `:append?valueInputOption=USER_ENTERED`;

  const response = await fetch(
    url,
    {
      method: "POST",
      headers: {
        Authorization:
          `Bearer ${token}`,
        "content-type":
          "application/json"
      },
      body: JSON.stringify({
        values: [row]
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      "Ошибка записи Google Sheets:\n" +
      await response.text()
    );
  }
}

async function updateValues(
  env,
  token,
  range,
  values
) {
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${env.SPREADSHEET_ID}` +
    `/values/${encodeURIComponent(range)}` +
    `?valueInputOption=USER_ENTERED`;

  const response = await fetch(
    url,
    {
      method: "PUT",
      headers: {
        Authorization:
          `Bearer ${token}`,
        "content-type":
          "application/json"
      },
      body: JSON.stringify({
        values
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      "Ошибка обновления Google Sheets:\n" +
      await response.text()
    );
  }
}

async function getAccessToken(env) {
    if (!env.GOOGLE_CLIENT_EMAIL) {
    throw new Error(
      "Не найдена переменная GOOGLE_CLIENT_EMAIL в Runtime secrets."
    );
  }

  if (!env.GOOGLE_PRIVATE_KEY) {
    throw new Error(
      "Не найдена переменная GOOGLE_PRIVATE_KEY в Runtime secrets."
    );
  }
  const now =
    Math.floor(
      Date.now() / 1000
    );

console.log("EMAIL:", JSON.stringify(env.GOOGLE_CLIENT_EMAIL));
console.log("EMAIL LENGTH:", env.GOOGLE_CLIENT_EMAIL?.length);
  
  const header = {
    alg: "RS256",
    typ: "JWT"
  };

  const payload = {
    iss:
      env.GOOGLE_CLIENT_EMAIL,
    scope:
      "https://www.googleapis.com/auth/spreadsheets",
    aud:
      "https://oauth2.googleapis.com/token",
    exp:
      now + 3600,
    iat:
      now
  };

  console.log("JWT iss:", payload.iss);

  const unsigned =
    `${base64url(
      JSON.stringify(header)
    )}.${base64url(
      JSON.stringify(payload)
    )}`;

  const signature =
    await signJwt(
      unsigned,
      env.GOOGLE_PRIVATE_KEY
    );

  const assertion =
    `${unsigned}.${signature}`;

  const response = await fetch(
    "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      headers: {
        "content-type":
          "application/x-www-form-urlencoded"
      },
      body:
        new URLSearchParams({
          grant_type:
            "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion
        })
    }
  );

  const data =
    await response.json();

  if (
    !response.ok ||
    !data.access_token
  ) {
    throw new Error(
      "Ошибка авторизации Google:\n" +
      JSON.stringify(data)
    );
  }

  return data.access_token;
}

async function signJwt(
  input,
  privateKeyPem
) {
  if (
    typeof privateKeyPem !== "string" ||
    !privateKeyPem.trim()
  ) {
    throw new Error(
      "GOOGLE_PRIVATE_KEY пустой или имеет неправильный формат."
    );
  }

  const pem = privateKeyPem
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n");

  if (
    !pem.includes("-----BEGIN PRIVATE KEY-----") ||
    !pem.includes("-----END PRIVATE KEY-----")
  ) {
    throw new Error(
      "GOOGLE_PRIVATE_KEY не содержит BEGIN PRIVATE KEY / END PRIVATE KEY."
    );
  }

  const keyData = pem
    .replace(
      "-----BEGIN PRIVATE KEY-----",
      ""
    )
    .replace(
      "-----END PRIVATE KEY-----",
      ""
    )
    .replace(
      /\s/g,
      ""
    );

  const binary =
    Uint8Array.from(
      atob(keyData),
      character =>
        character.charCodeAt(0)
    );

  const key =
    await crypto.subtle.importKey(
      "pkcs8",
      binary,
      {
        name:
          "RSASSA-PKCS1-v1_5",
        hash:
          "SHA-256"
      },
      false,
      ["sign"]
    );

  const signature =
    await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      key,
      new TextEncoder()
        .encode(input)
    );

  return base64urlArrayBuffer(
    signature
  );
}

function base64url(value) {
  return btoa(value)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlArrayBuffer(
  buffer
) {
  let binary = "";

  for (
    const byte of
    new Uint8Array(buffer)
  ) {
    binary +=
      String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sendMessage(
  token,
  chatId,
  text,
  replyMarkup = null
) {
  const payload = {
    chat_id: chatId,
    text
  };

  if (replyMarkup) {
    payload.reply_markup =
      replyMarkup;
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "content-type":
          "application/json"
      },
      body:
        JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    throw new Error(
      "Ошибка Telegram:\n" +
      await response.text()
    );
  }
}

async function answerCallback(
  token,
  callbackQueryId
) {
  await fetch(
    `https://api.telegram.org/bot${token}/answerCallbackQuery`,
    {
      method: "POST",
      headers: {
        "content-type":
          "application/json"
      },
      body:
        JSON.stringify({
          callback_query_id:
            callbackQueryId
        })
    }
  );
}

async function generatePdf(env, formId) {
  const form = await getForm(env, formId);

  if (!form) {
    throw new Error("Анкета не найдена.");
  }

  const answers = await getAnswers(env, formId);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const regularFontBytes = await fetchFont(
    "https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf"
  );

  const boldFontBytes = await fetchFont(
    "https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Bold.ttf"
  );

  const regularFont = await pdfDoc.embedFont(
    regularFontBytes
  );

  const boldFont = await pdfDoc.embedFont(
    boldFontBytes
  );

  const pageWidth = 595.28;
  const pageHeight = 841.89;

  const marginLeft = 46;
  const marginRight = 46;
  const marginTop = 48;
  const marginBottom = 48;

  const contentWidth =
    pageWidth - marginLeft - marginRight;

  let page = pdfDoc.addPage([
    pageWidth,
    pageHeight
  ]);

  let y = pageHeight - marginTop;

  function addPage() {
    page = pdfDoc.addPage([
      pageWidth,
      pageHeight
    ]);

    y = pageHeight - marginTop;

    drawPageHeader();
  }

  function drawPageHeader() {
    page.drawText(
      "АНКЕТА ПОКУПАТЕЛЯ",
      {
        x: marginLeft,
        y,
        size: 10,
        font: boldFont,
        color: rgb(
          0.55,
          0.35,
          0.12
        )
      }
    );

    page.drawLine({
      start: {
        x: marginLeft,
        y: y - 8
      },
      end: {
        x:
          pageWidth -
          marginRight,
        y: y - 8
      },
      thickness: 0.8,
      color: rgb(
        0.82,
        0.69,
        0.51
      )
    });

    y -= 28;
  }

  function ensureSpace(height) {
    if (
      y - height <
      marginBottom
    ) {
      addPage();
    }
  }

  function drawTextBlock(
    text,
    options = {}
  ) {
    const size =
      options.size || 10;

    const font =
      options.font ||
      regularFont;

    const color =
      options.color ||
      rgb(0.15, 0.15, 0.15);

    const lineHeight =
      options.lineHeight ||
      size + 4;

    const maxWidth =
      options.maxWidth ||
      contentWidth;

    const x =
      options.x ??
      marginLeft;

    const lines = wrapText(
      String(text || ""),
      font,
      size,
      maxWidth
    );

    ensureSpace(
      lines.length *
        lineHeight +
        4
    );

    for (
      const line of lines
    ) {
      page.drawText(
        line || " ",
        {
          x,
          y,
          size,
          font,
          color
        }
      );

      y -= lineHeight;
    }

    return lines.length;
  }

  function drawSectionTitle(
    title
  ) {
    ensureSpace(46);

    y -= 7;

    page.drawRectangle({
      x: marginLeft,
      y: y - 24,
      width: contentWidth,
      height: 30,
      color: rgb(
        0.96,
        0.93,
        0.88
      ),
      borderColor: rgb(
        0.82,
        0.69,
        0.51
      ),
      borderWidth: 0.8
    });

    page.drawText(title, {
      x: marginLeft + 10,
      y: y - 14,
      size: 11,
      font: boldFont,
      color: rgb(
        0.25,
        0.18,
        0.1
      )
    });

    y -= 40;
  }

  function drawAnswerRow(
    question,
    answer
  ) {
    const safeAnswer =
      String(answer || "")
        .trim() ||
      "Не указано";

    const labelWidth = 205;
    const valueWidth =
      contentWidth -
      labelWidth;

    const questionLines =
      wrapText(
        question,
        regularFont,
        8.5,
        labelWidth - 16
      );

    const answerLines =
      wrapText(
        safeAnswer,
        regularFont,
        9,
        valueWidth - 16
      );

    const numberOfLines =
      Math.max(
        questionLines.length,
        answerLines.length
      );

    const rowHeight =
      Math.max(
        34,
        numberOfLines * 13 +
          16
      );

    ensureSpace(rowHeight + 4);

    const rowBottom =
      y - rowHeight;

    page.drawRectangle({
      x: marginLeft,
      y: rowBottom,
      width: labelWidth,
      height: rowHeight,
      color: rgb(
        0.98,
        0.98,
        0.98
      ),
      borderColor: rgb(
        0.78,
        0.78,
        0.78
      ),
      borderWidth: 0.5
    });

    page.drawRectangle({
      x:
        marginLeft +
        labelWidth,
      y: rowBottom,
      width: valueWidth,
      height: rowHeight,
      borderColor: rgb(
        0.78,
        0.78,
        0.78
      ),
      borderWidth: 0.5
    });

    let questionY =
      y - 15;

    for (
      const line of
      questionLines
    ) {
      page.drawText(line, {
        x: marginLeft + 8,
        y: questionY,
        size: 8.5,
        font: regularFont,
        color: rgb(
          0.25,
          0.25,
          0.25
        )
      });

      questionY -= 13;
    }

    let answerY =
      y - 15;

    for (
      const line of
      answerLines
    ) {
      page.drawText(line, {
        x:
          marginLeft +
          labelWidth +
          8,
        y: answerY,
        size: 9,
        font: regularFont,
        color: rgb(
          0.1,
          0.1,
          0.1
        )
      });

      answerY -= 13;
    }

    y =
      rowBottom;
  }

  page.drawText(
    "АНКЕТА ПОКУПАТЕЛЯ",
    {
      x: marginLeft,
      y,
      size: 22,
      font: boldFont,
      color: rgb(
        0.25,
        0.18,
        0.1
      )
    }
  );

  y -= 14;

  page.drawLine({
    start: {
      x: marginLeft,
      y
    },
    end: {
      x:
        pageWidth -
        marginRight,
      y
    },
    thickness: 2,
    color: rgb(
      0.82,
      0.58,
      0.28
    )
  });

  y -= 32;

  drawTextBlock(
    `Номер анкеты: ${form.number}`,
    {
      size: 10,
      font: boldFont
    }
  );

  drawTextBlock(
    `Название: ${form.title}`,
    {
      size: 10
    }
  );

  drawTextBlock(
    `Специалист: ${form.broker}`,
    {
      size: 10
    }
  );

  drawTextBlock(
    `Дата формирования: ${formatPdfDate(new Date())}`,
    {
      size: 9,
      color: rgb(
        0.4,
        0.4,
        0.4
      )
    }
  );

  y -= 12;

 for (
  const [
    sectionId,
    sectionTitle
  ] of SECTIONS
) {
  if (sectionId === "consent") {
    continue;
  }

  drawSectionTitle(
    sectionTitle
  );

  const questions =
    QUESTIONS[sectionId] ||
    [];

  for (
    const question of
    questions
  ) {
    const answer =
      answers[
        `${sectionId}:${question.id}`
      ];

    drawAnswerRow(
      question.title,
      answer
    );
  }
}
drawConsentBlock();
    for (
      const question of
      questions
    ) {
      const answer =
        answers[
          `${sectionId}:${question.id}`
        ];

      drawAnswerRow(
        question.title,
        answer
      );
    }

    y -= 10;
  }

  ensureSpace(90);

  y -= 15;

  page.drawLine({
    start: {
      x: marginLeft,
      y
    },
    end: {
      x:
        pageWidth -
        marginRight,
      y
    },
    thickness: 0.8,
    color: rgb(
      0.7,
      0.7,
      0.7
    )
  });

  y -= 30;

  page.drawText(
    "Подпись покупателя:",
    {
      x: marginLeft,
      y,
      size: 9,
      font: regularFont,
      color: rgb(
        0.2,
        0.2,
        0.2
      )
    }
  );

  page.drawLine({
    start: {
      x: marginLeft + 120,
      y: y - 2
    },
    end: {
      x: marginLeft + 300,
      y: y - 2
    },
    thickness: 0.7,
    color: rgb(
      0.3,
      0.3,
      0.3
    )
  });

  page.drawText(
    "Дата:",
    {
      x:
        marginLeft +
        330,
      y,
      size: 9,
      font: regularFont
    }
  );

  page.drawLine({
    start: {
      x:
        marginLeft +
        370,
      y: y - 2
    },
    end: {
      x:
        pageWidth -
        marginRight,
      y: y - 2
    },
    thickness: 0.7,
    color: rgb(
      0.3,
      0.3,
      0.3
    )
  });

  const pages =
    pdfDoc.getPages();

  pages.forEach(
    (currentPage, index) => {
      currentPage.drawText(
        `Страница ${index + 1} из ${pages.length}`,
        {
          x:
            pageWidth -
            marginRight -
            90,
          y: 22,
          size: 8,
          font: regularFont,
          color: rgb(
            0.5,
            0.5,
            0.5
          )
        }
      );

      currentPage.drawText(
        form.number,
        {
          x: marginLeft,
          y: 22,
          size: 8,
          font: regularFont,
          color: rgb(
            0.5,
            0.5,
            0.5
          )
        }
      );
    }
  );

  return pdfDoc.save();
}

function drawConsentBlock() {
  // Если на текущей странице мало места,
  // ensureSpace автоматически создаст новую страницу.
  ensureSpace(360);

  y -= 14;

  // Верхняя разделительная линия
  page.drawLine({
    start: {
      x: marginLeft,
      y
    },
    end: {
      x: marginLeft + contentWidth,
      y
    },
    thickness: 0.8,
    color: rgb(
      0.82,
      0.69,
      0.51
    )
  });

  y -= 26;

  // Заголовок
  page.drawText(
    "Согласие на проверку и обработку данных",
    {
      x: marginLeft,
      y,
      size: 12,
      font: boldFont,
      color: rgb(
        0.25,
        0.18,
        0.1
      )
    }
  );

  y -= 32;

  // Поле для ФИО
  page.drawText(
    "Я, _________________________________________________,",
    {
      x: marginLeft,
      y,
      size: 10.5,
      font,
      color: rgb(
        0.12,
        0.12,
        0.12
      )
    }
  );

  y -= 28;

  const consentParagraph1 = [
    "подтверждаю достоверность предоставленных сведений и даю согласие",
    "агентству недвижимости, Продавцу и уполномоченным ими лицам",
    "на обработку моих персональных данных, а также на проверку",
    "предоставленной информации в целях оценки возможности заключения",
    "договора купли-продажи недвижимости."
  ];

  for (
    const line of
    consentParagraph1
  ) {
    page.drawText(
      line,
      {
        x: marginLeft,
        y,
        size: 10.5,
        font,
        color: rgb(
          0.12,
          0.12,
          0.12
        )
      }
    );

    y -= 17;
  }

  y -= 18;

  const consentParagraph2 = [
    "Мне известно, что предоставление недостоверной информации может",
    "являться основанием для отказа в заключении договора или его",
    "расторжения в случаях, предусмотренных законом и договором."
  ];

  for (
    const line of
    consentParagraph2
  ) {
    page.drawText(
      line,
      {
        x: marginLeft,
        y,
        size: 10.5,
        font,
        color: rgb(
          0.12,
          0.12,
          0.12
        )
      }
    );

    y -= 17;
  }

  y -= 40;

  // Строка даты
  page.drawText(
    "Дата",
    {
      x: marginLeft,
      y,
      size: 10.5,
      font: boldFont,
      color: rgb(
        0.12,
        0.12,
        0.12
      )
    }
  );

  page.drawText(
    "«____» __________________ 20___ г.",
    {
      x: marginLeft + 72,
      y,
      size: 10.5,
      font,
      color: rgb(
        0.12,
        0.12,
        0.12
      )
    }
  );

  y -= 54;

  // Строка подписи
  page.drawText(
    "Подпись Покупателя",
    {
      x: marginLeft,
      y,
      size: 10.5,
      font: boldFont,
      color: rgb(
        0.12,
        0.12,
        0.12
      )
    }
  );

  page.drawText(
    "____________________ /____________________/",
    {
      x: marginLeft + 145,
      y,
      size: 10.5,
      font,
      color: rgb(
        0.12,
        0.12,
        0.12
      )
    }
  );

  y -= 30;
}

async function fetchFont(url) {
  const response =
    await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Не удалось загрузить шрифт: ${response.status}`
    );
  }

  return response.arrayBuffer();
}

function wrapText(
  text,
  font,
  fontSize,
  maxWidth
) {
  const paragraphs =
    String(text || "")
      .replace(/\r/g, "")
      .split("\n");

  const lines = [];

  for (
    const paragraph of
    paragraphs
  ) {
    if (!paragraph.trim()) {
      lines.push("");
      continue;
    }

    const words =
      paragraph.split(/\s+/);

    let currentLine = "";

    for (
      const word of words
    ) {
      const candidate =
        currentLine
          ? `${currentLine} ${word}`
          : word;

      const candidateWidth =
        font.widthOfTextAtSize(
          candidate,
          fontSize
        );

      if (
        candidateWidth <=
        maxWidth
      ) {
        currentLine =
          candidate;
        continue;
      }

      if (currentLine) {
        lines.push(
          currentLine
        );
      }

      if (
        font.widthOfTextAtSize(
          word,
          fontSize
        ) <= maxWidth
      ) {
        currentLine = word;
        continue;
      }

      let fragment = "";

      for (
        const character of
        word
      ) {
        const testFragment =
          fragment +
          character;

        if (
          font.widthOfTextAtSize(
            testFragment,
            fontSize
          ) <= maxWidth
        ) {
          fragment =
            testFragment;
        } else {
          if (fragment) {
            lines.push(
              fragment
            );
          }

          fragment =
            character;
        }
      }

      currentLine =
        fragment;
    }

    if (currentLine) {
      lines.push(
        currentLine
      );
    }
  }

  return lines.length
    ? lines
    : [""];
}

function formatPdfDate(date) {
  return new Intl.DateTimeFormat(
    "ru-RU",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Moscow"
    }
  ).format(date);
}

function sanitizeFileName(
  value
) {
  const cleaned =
    String(
      value || "Анкета"
    )
      .replace(
        /[\\/:*?"<>|]/g,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  return (
    cleaned ||
    "Анкета"
  ).slice(0, 80);
}

async function sendPdf(
  token,
  chatId,
  pdfBuffer,
  fileName
) {
  const formData =
    new FormData();

  formData.append(
    "chat_id",
    String(chatId)
  );

  formData.append(
    "caption",
    "Анкета покупателя сформирована ✅"
  );

  formData.append(
    "document",
    new Blob(
      [pdfBuffer],
      {
        type:
          "application/pdf"
      }
    ),
    fileName
  );

  const response =
    await fetch(
      `https://api.telegram.org/bot${token}/sendDocument`,
      {
        method: "POST",
        body: formData
      }
    );

  if (!response.ok) {
    throw new Error(
      "Ошибка отправки PDF:\n" +
      await response.text()
    );
  }
}
