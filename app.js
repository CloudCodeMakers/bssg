const { TelegramClient } = gramjs;
const { StringSession } = gramjs.sessions;
const { Logger } = gramjs.extensions;

Logger.setLevel("none");

var resolveCode;
var resolvePassword;

const startLoading = () => {
  document.querySelector("#loader svg").style.width = "100px";
  document.querySelector("#loader").style.height = "100%";
};

const stopLoading = () => {
  document.querySelector("#loader svg").style.width = "0";
  document.querySelector("#loader").style.height = "0";
};

const hideAll = () => {
  const children = document.querySelector(".container").children;

  for (let child in children) {
    child = children[child];

    if (child && child.style) child.style.display = "none";
  }
};

const showCodeInput = () => {
  hideAll();
  document.querySelector("#code").style.display = "block";
  document.querySelector("#codeb").style.display = "block";
};

const showPasswordInput = () => {
  hideAll();
  document.querySelector("#password").style.display = "block";
  document.querySelector("#passwordb").style.display = "block";
};

const showResult = () => {
  document.querySelector("#password").style.display = "none";
  document.querySelector("#passwordb").style.display = "none";
  document.querySelector("#result").style.display = "block";
};

const start = async () => {
  const apiId = document.querySelector("#apiId").valueAsNumber;
  const apiHash = document.querySelector("#apiHash").value;
  const number = document.querySelector("#number").value;

  if (!apiId) {
    document.querySelector("#apiId").focus();
    return;
  } else if (!apiHash) {
    document.querySelector("#apiHash").focus();
    return;
  } else if (!number) {
    document.querySelector("#number").focus();
    return;
  }

  startLoading();

  const client = new TelegramClient(new StringSession(), apiId, apiHash, {
    connectionRetries: 5,
    useWSS: window.location.protocol == "https:",
  });

  await client.start({
    phoneNumber: number,
    phoneCode: () =>
      new Promise((resolve, _) => {
        resolveCode = resolve;
        showCodeInput();
        stopLoading();
      }),
    password: () =>
      new Promise((resolve, _) => {
        resolvePassword = resolve;
        showPasswordInput();
        stopLoading();
      }),
    onError: (error) => alert(error),
  });

  const message = `The generated string session by BSSG:\n\n${client.session.save()}`;
  await client.sendMessage("me", { message: message });

  showResult();
  stopLoading();
};

const code = () => {
  startLoading();
  resolveCode(document.querySelector("#code").value);
};

const password = () => {
  startLoading();
  resolvePassword(document.querySelector("#password").value);
};

stopLoading();
