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
const Context = {
  GetFolder: (folder) => {
    assert.equal(folder, "InstancedGameFolder");
    return "instance";
  },
  PatchFileFindPattern: (...args) => patchCalls.push(args),
};
const Nucleus = { Folder: { InstancedGameFolder: "InstancedGameFolder" } };
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
  " -screen-fullscreen 0 -popupwindow -screen-width 1280 -screen-height 720 -screen-quality Fastest",
  "WGI patch must preserve launch arguments",
);

assert.equal(Game.MaxPlayers, 4, "handler must allow four total players");
assert.equal(Game.MaxPlayersOneMonitor, 2, "handler must keep two players per monitor");
assert.equal(Game.ProtoInput.XinputHook, true, "ProtoInput must isolate XInput controllers");
assert.equal(Game.ProtoInput.UseOpenXinput, true, "OpenXInput must expose x360ce slots");
assert.equal(Game.ProtoInput.MultipleProtoControllers, undefined);
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
