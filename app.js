const { TelegramClient } = gramjs;
const { StringSession } = gramjs.sessions;

var client;
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

const showCodeInput = () => {
  document.querySelector("#apiId").style.display = "none";
  document.querySelector("#apiHash").style.display = "none";
  document.querySelector("#init").style.display = "none";
  document.querySelector("#number").style.display = "none";
  document.querySelector("#start").style.display = "none";
  document.querySelector("#code").style.display = "block";
  document.querySelector("#codeb").style.display = "block";
};

const showPasswordInput = () => {
  document.querySelector("#code").style.display = "none";
  document.querySelector("#codeb").style.display = "none";
  document.querySelector("#password").style.display = "block";
  document.querySelector("#passwordb").style.display = "block";
};

const showResult = () => {
  document.querySelector("#password").style.display = "none";
  document.querySelector("#passwordb").style.display = "none";
  document.querySelector("#result").style.display = "block";
};

const init = () => {
  client = new TelegramClient(
    new StringSession(),
    document.querySelector("#apiId").valueAsNumber,
    document.querySelector("#apiHash").value,
    { connectionRetries: 5 }
  );
  document.querySelector("#number").disabled = false;
  document.querySelector("#start").disabled = false;
};

const start = async () => {
  startLoading();
  await client.start({
    phoneNumber: document.querySelector("#number").value,
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
