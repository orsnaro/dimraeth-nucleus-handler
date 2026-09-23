const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const handlerPath = path.join(__dirname, "..", "Dimraeth.js");
const handlerSource = fs.readFileSync(handlerPath, "utf8");
const calls = [];

// Records ProtoInput API calls made by the handler callbacks.
const record = (method) => (...args) => calls.push([method, ...args]);
const values = [
  "GetCursorPosHookID",
  "SetCursorPosHookID",
  "GetKeyStateHookID",
  "GetAsyncKeyStateHookID",
  "GetKeyboardStateHookID",
  "CursorVisibilityStateHookID",
  "RawInputFilterID",
  "MouseActivateFilterID",
  "WindowActivateFilterID",
  "WindowActivateAppFilterID",
  "MouseMoveFilterID",
  "MouseWheelFilterID",
  "MouseButtonFilterID",
  "KeyboardButtonFilterID",
];
const ProtoInput = {
  Values: Object.fromEntries(values.map((value) => [value, value])),
  InstallHook: record("InstallHook"),
  UninstallHook: record("UninstallHook"),
  EnableMessageFilter: record("EnableMessageFilter"),
  DisableMessageFilter: record("DisableMessageFilter"),
  SetDrawFakeCursor: record("SetDrawFakeCursor"),
  SetRawInputBypass: record("SetRawInputBypass"),
};
const Game = { Hook: {}, ProtoInput: {} };
const patchCalls = [];
const registryWrites = [];
const Context = {
  Width: 2560,
  Height: 720,
  PosX: 0,
  PosY: 720,
  GetFolder: (folder) => {
    assert.equal(folder, "InstancedGameFolder");
    return "instance";
  },
  PatchFileFindPattern: (...args) => patchCalls.push(args),
  EditRegKey: (...args) => registryWrites.push(args),
};
const Nucleus = {
  Folder: { InstancedGameFolder: "InstancedGameFolder" },
  RegType: { DWord: "DWord" },
};
const PlayerList = {
  Count: 2,
  0: { IsXInput: false, ProtoInputInstanceHandle: 7 },
  1: { IsXInput: true, ProtoInputInstanceHandle: 8 },
};

vm.runInNewContext(handlerSource, { Context, Game, Nucleus, PlayerList, ProtoInput });
Game.Play();
assert.ok(
  Game.FileSymlinkCopyInstead.includes("UnityPlayer.dll"),
  "UnityPlayer.dll must be copied per instance before patching",
);
assert.equal(patchCalls.length, 1, "Game.Play must apply one WGI patch");

const [sourcePath, destinationPath, searchPattern, patchPattern, patchAll] = patchCalls[0];
assert.equal(sourcePath, "instance\\UnityPlayer.dll");
assert.equal(destinationPath, sourcePath, "patch must stay inside the instance copy");
assert.equal(
  searchPattern,
  "57 00 69 00 6E 00 64 00 6F 00 77 00 73 00 2E 00 47 00 61 00 6D 00 69 00 6E 00 67 00 2E 00 49 00 6E 00 70 00 75 00 74 00 2E 00 47 00 61 00 6D 00 65 00 70 00 61 00 64",
);
const searchTokens = searchPattern.split(" ");
const patchTokens = patchPattern.split(" ");
assert.equal(searchTokens.length, 55, "WGI search pattern must contain 55 bytes");
assert.equal(patchTokens.length, 55, "WGI replacement must contain 55 bytes");
assert.ok(patchTokens.every((token) => token === "00"), "WGI replacement must be all zero bytes");
assert.equal(patchAll, true, "Nucleus patch API must use the established final flag");
assert.equal(
  Context.StartArguments,
  " -screen-fullscreen 0 -popupwindow -screen-width 2560 -screen-height 720 -screen-quality Fastest",
  "launch resolution must match the assigned split-screen bounds",
);

// Reports whether Game.Play wrote one expected Unity display setting.
const hasRegistryWrite = (name, value) =>
  registryWrites.some(
    ([root, keyPath, valueName, data, type]) =>
      root === "HKEY_CURRENT_USER" &&
      keyPath === "SOFTWARE\\Mudtek\\Dimraeth" &&
      valueName === name &&
      data === value &&
      type === "DWord",
  );

assert.ok(hasRegistryWrite("Screenmanager Fullscreen mode_h3630240806", 3));
assert.ok(hasRegistryWrite("Screenmanager Resolution Use Native_h1405027254", 0));
assert.ok(hasRegistryWrite("Screenmanager Resolution Width_h182942802", 2560));
assert.ok(hasRegistryWrite("Screenmanager Resolution Height_h2627697771", 720));
assert.ok(hasRegistryWrite("Screenmanager Window Position X_h4088080503", 0));
assert.ok(hasRegistryWrite("Screenmanager Window Position Y_h4088080502", 720));

// Nucleus calls Game.Play before each serialized launch with that player's bounds.
registryWrites.length = 0;
Context.Width = 1280;
Context.Height = 1440;
Context.PosX = 1280;
Context.PosY = 0;
Game.Play();
assert.equal(
  Context.StartArguments,
  " -screen-fullscreen 0 -popupwindow -screen-width 1280 -screen-height 1440 -screen-quality Fastest",
  "each instance must receive its own split-screen bounds",
);
assert.ok(hasRegistryWrite("Screenmanager Resolution Width_h182942802", 1280));
assert.ok(hasRegistryWrite("Screenmanager Resolution Height_h2627697771", 1440));
assert.ok(hasRegistryWrite("Screenmanager Window Position X_h4088080503", 1280));
assert.ok(hasRegistryWrite("Screenmanager Window Position Y_h4088080502", 0));

assert.equal(Game.MaxPlayers, 4, "handler must allow four total players");
assert.equal(Game.MaxPlayersOneMonitor, 2, "handler must keep two players per monitor");
assert.equal(Game.ProtoInput.XinputHook, true, "ProtoInput must isolate XInput controllers");
assert.equal(Game.ProtoInput.UseOpenXinput, true, "OpenXInput must expose x360ce slots");
assert.equal(Game.ProtoInput.MultipleProtoControllers, undefined);
assert.equal(Game.ProtoInput.SetWindowPosHook, true, "handler must block game window reposition/resize");
assert.equal(Game.ProtoInput.MoveWindowHook, true, "handler must block game MoveWindow reposition/resize");
assert.equal(
  Game.ProtoInput.InjectRuntime_RemoteLoadMethod,
  true,
  "baseline must retain ProtoInput RemoteLoad injection",
);
Game.ProtoInput.OnInputLocked();

assert.ok(
  calls.some(
    ([method, handle, filter]) =>
      method === "EnableMessageFilter" &&
      handle === 7 &&
      filter === "RawInputFilterID",
  ),
  "input lock must enable selected-device raw input filtering",
);
assert.ok(
  calls.some(
    ([method, handle, filter]) =>
      method === "EnableMessageFilter" &&
      handle === 7 &&
      filter === "MouseButtonFilterID",
  ),
  "input lock must enable mouse button filtering",
);
assert.ok(
  calls.some(
    ([method, handle, filter]) =>
      method === "EnableMessageFilter" &&
      handle === 7 &&
      filter === "MouseWheelFilterID",
  ),
  "input lock must enable mouse wheel filtering",
);
assert.ok(
  !calls.some(
    ([method, , filter]) =>
      method === "EnableMessageFilter" && filter === "MouseMoveFilterID",
  ),
  "input lock must leave the optional Unity-breaking mouse-move filter disabled",
);
assert.ok(
  !calls.some(([, handle]) => handle === 8),
  "input lock must not apply keyboard/mouse operations to XInput players",
);

calls.length = 0;
Game.ProtoInput.OnInputUnlocked();

assert.ok(
  calls.some(
    ([method, handle, filter]) =>
      method === "DisableMessageFilter" &&
      handle === 7 &&
      filter === "RawInputFilterID",
  ),
  "input unlock must disable selected-device raw input filtering",
);
assert.ok(
  !calls.some(
    ([method, , filter]) =>
      method === "DisableMessageFilter" && filter === "MouseMoveFilterID",
  ),
  "input unlock must not manage the unused mouse-move filter",
);
assert.ok(
  !calls.some(([, handle]) => handle === 8),
  "input unlock must not apply keyboard/mouse operations to XInput players",
);

console.log("Dimraeth input-lock behavior checks passed.");
