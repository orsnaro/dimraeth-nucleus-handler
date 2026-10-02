Game.ExecutableContext = ["Dimraeth_Data"];
Game.GameName = "Dimraeth";
Game.HandlerInterval = 100;
Game.SymlinkExe = false;
Game.SymlinkGame = true;
Game.SymlinkFolders = true;
Game.FileSymlinkCopyInstead = ["UnityPlayer.dll"];
// Steam P2P routes by CSteamID, not IP: two instances sharing one emulated ID
// means only one joins / both kicked. Flags default OFF so OFME/OnlineFix
// builds launch exactly as before; Game.Play enables the split on clean builds.
Game.SteamID = "2402680";
Game.UseGoldberg = false;
Game.CreateSteamAppIdByExe = false;
Game.ExecutableName = "Dimraeth.exe";
Game.GUID = "Dimraeth";
Game.MaxPlayers = 4;
Game.MaxPlayersOneMonitor = 2;
Game.LauncherTitle = "";
Game.ResetWindows = true;
Game.RefreshWindowAfterStart = true;
Game.SetForegroundWindowElsewhere = true;
// Isolates LocalLow saves per instance; existing saves seed each copy.
Game.UserProfileSavePath = "AppData\\LocalLow\\Mudtek";
Game.Hook.ForceFocus = false;
Game.Hook.ForceFocusWindowName = "Dimraeth";
Game.Hook.DInputEnabled = false;
Game.Hook.XInputEnabled = false;
Game.Hook.XInputReroute = false;
Game.Hook.CustomDllEnabled = false;
Game.BlockRawInput = false;
Game.PromptBetweenInstances = true;
Game.PauseBetweenProcessGrab = 15;
Game.PauseBetweenStarts = 45;
// Never kill running game processes on session start: a Waygate dedicated
// server is the same Dimraeth.exe and must survive instance launches.
Game.ForceFinishOnPlay = false;
Game.Description =
  "Up to four players using controllers, keyboard/mouse pairs, or a mix, with at most two players per monitor. For single-monitor splits turn Fullscreen OFF in each video settings menu, then press Ctrl+R so Nucleus placement holds. Keep x360ce running for DirectInput controllers. Nucleus patches only temporary UnityPlayer.dll copies to isolate controllers. Two instances can commit 10-16 GB combined, so restart first, close heavy background apps, and keep the pagefile system-managed. Wait until each window is responsive before continuing. Press END to lock keyboard/mouse input; press END again before CTRL+Q. Online: needs a clean Steam build plus distinct Player Steam IDs (Players tab), same subnet with Network Discovery on, and Player 1 hosting before others join. OnlineFix/OFME builds stay local-only: their bundled emulator conflicts with per-instance Steam separation.";

// Legacy input settings stay disabled because ProtoInput owns isolation.
Game.HookSetCursorPos = false;
Game.HookGetCursorPos = false;
Game.HookGetKeyState = false;
Game.HookGetAsyncKeyState = false;
Game.HookGetKeyboardState = false;
Game.HookFilterRawInput = false;
Game.HookFilterMouseMessages = false;
Game.HookUseLegacyInput = false;
Game.HookDontUpdateLegacyInMouseMsg = false;
Game.HookMouseVisibility = false;
Game.SendNormalMouseInput = false;
Game.SendNormalKeyboardInput = false;
Game.SendScrollWheel = false;
Game.ForwardRawKeyboardInput = false;
Game.ForwardRawMouseInput = false;
Game.HookReRegisterRawInput = false;
Game.HookReRegisterRawInputMouse = false;
Game.HookReRegisterRawInputKeyboard = false;
Game.DrawFakeMouseCursor = false;

Game.SupportsMultipleKeyboardsAndMice = true;
Game.ProtoInput.InjectStartup = false;
Game.ProtoInput.InjectRuntime_RemoteLoadMethod = true;
Game.ProtoInput.InjectRuntime_EasyHookMethod = false;
Game.ProtoInput.InjectRuntime_EasyHookStealthMethod = false;
Game.LockInputAtStart = false;
Game.LockInputSuspendsExplorer = true;
Game.ProtoInput.FreezeExternalInputWhenInputNotLocked = true;
Game.LockInputToggleKey = 0x23;
Game.ProtoInput.RenameHandlesHook = false;
Game.ProtoInput.RenameHandles = [];
Game.ProtoInput.RenameNamedPipes = [];
// Always installed: raw-input plumbing, clipping, focus detection.
Game.ProtoInput.RegisterRawInputHook = true;
Game.ProtoInput.GetRawInputDataHook = true;
Game.ProtoInput.MessageFilterHook = true;
Game.ProtoInput.ClipCursorHook = true;
Game.ProtoInput.FocusHooks = true;
Game.ProtoInput.ClipCursorHookCreatesFakeClip = true;

// Keep Nucleus split placement: block game-driven resize/reposition.
Game.ProtoInput.SetWindowPosHook = true;
Game.ProtoInput.MoveWindowHook = true;

// Installed on input lock (Vellum pattern): cursor, keyboard state, visibility.
Game.ProtoInput.GetCursorPosHook = false;
Game.ProtoInput.SetCursorPosHook = false;
Game.ProtoInput.GetKeyStateHook = false;
Game.ProtoInput.GetAsyncKeyStateHook = false;
Game.ProtoInput.GetKeyboardStateHook = false;
Game.ProtoInput.CursorVisibilityHook = false;

// Message sending stays on; freeze-when-unlocked gates delivery.
Game.ProtoInput.SendMouseWheelMessages = true;
Game.ProtoInput.SendMouseButtonMessages = true;
Game.ProtoInput.SendMouseMovementMessages = true;
Game.ProtoInput.SendKeyboardButtonMessages = true;

Game.ProtoInput.EnableToggleFakeCursorVisibilityShortcut = false;
Game.ProtoInput.DontShowCursorWhenImageUpdated = true;
Game.ProtoInput.AllowFakeCursorOutOfBounds = true;
Game.ProtoInput.ExtendFakeCursorBounds = true;

// Filters enabled on lock, disabled on unlock.
Game.ProtoInput.RawInputFilter = false;
Game.ProtoInput.MouseMoveFilter = false;
Game.ProtoInput.MouseActivateFilter = false;
Game.ProtoInput.WindowActivateFilter = false;
Game.ProtoInput.WindowActvateAppFilter = false;
Game.ProtoInput.MouseWheelFilter = false;
Game.ProtoInput.MouseButtonFilter = false;
Game.ProtoInput.KeyboardButtonFilter = false;
Game.ProtoInput.XinputHook = true;
Game.ProtoInput.UseOpenXinput = true;
Game.ProtoInput.UseDinputRedirection = false;
Game.ProtoInput.DinputDeviceHook = false;
Game.ProtoInput.DinputHookAlsoHooksGetDeviceState = false;
Game.ProtoInput.EnableFocusMessageLoop = true;
Game.ProtoInput.FocusLoopIntervalMilliseconds = 5;
Game.ProtoInput.FocusLoop_WM_ACTIVATE = true;
Game.ProtoInput.FocusLoop_WM_SETFOCUS = true;
Game.ProtoInput.FocusLoop_WM_MOUSEACTIVATE = true;
Game.ProtoInput.FocusLoop_WM_ACTIVATEAPP = false;
Game.ProtoInput.FocusLoop_WM_NCACTIVATE = false;
Game.ProtoInput.BlockedMessages = [0x0008, 0x02a3, 0x02a1];
Game.ProtoInput.DrawFakeCursor = false;

// Binds input hooks to the live game window at lock time (Vellum pattern).
Game.ProtoInput.OnInputLocked = function() {
  for (var i = 0; i < PlayerList.Count; i++) {
    var player = PlayerList[i];
    if (player.IsXInput) {
      continue;
    }
    ProtoInput.InstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.GetCursorPosHookID);
    ProtoInput.InstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.SetCursorPosHookID);
    ProtoInput.InstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.GetKeyStateHookID);
    ProtoInput.InstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.GetAsyncKeyStateHookID);
    ProtoInput.InstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.GetKeyboardStateHookID);
    ProtoInput.InstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.CursorVisibilityStateHookID);
    ProtoInput.EnableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.RawInputFilterID);
    // Unity receives mouse movement through forwarded raw input; filtering WM_MOUSEMOVE can suppress it.
    ProtoInput.EnableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.MouseActivateFilterID);
    ProtoInput.EnableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.WindowActivateFilterID);
    ProtoInput.EnableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.WindowActivateAppFilterID);
    ProtoInput.EnableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.MouseWheelFilterID);
    ProtoInput.EnableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.MouseButtonFilterID);
    ProtoInput.EnableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.KeyboardButtonFilterID);
    ProtoInput.SetDrawFakeCursor(player.ProtoInputInstanceHandle, true);
    ProtoInput.SetRawInputBypass(player.ProtoInputInstanceHandle, false);
  }
};

Game.ProtoInput.OnInputUnlocked = function() {
  for (var i = 0; i < PlayerList.Count; i++) {
    var player = PlayerList[i];
    if (player.IsXInput) {
      continue;
    }
    ProtoInput.UninstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.GetCursorPosHookID);
    ProtoInput.UninstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.SetCursorPosHookID);
    ProtoInput.UninstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.GetKeyStateHookID);
    ProtoInput.UninstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.GetAsyncKeyStateHookID);
    ProtoInput.UninstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.GetKeyboardStateHookID);
    ProtoInput.UninstallHook(player.ProtoInputInstanceHandle, ProtoInput.Values.CursorVisibilityStateHookID);
    ProtoInput.DisableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.RawInputFilterID);
    ProtoInput.DisableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.MouseActivateFilterID);
    ProtoInput.DisableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.WindowActivateFilterID);
    ProtoInput.DisableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.WindowActivateAppFilterID);
    ProtoInput.DisableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.MouseWheelFilterID);
    ProtoInput.DisableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.MouseButtonFilterID);
    ProtoInput.DisableMessageFilter(player.ProtoInputInstanceHandle, ProtoInput.Values.KeyboardButtonFilterID);
    ProtoInput.SetDrawFakeCursor(player.ProtoInputInstanceHandle, false);
    ProtoInput.SetRawInputBypass(player.ProtoInputInstanceHandle, true);
  }
};

// Patches WGI and launches each instance inside its assigned Nucleus region.
Game.Play = function() {
  // OFME/OnlineFix builds ship their own emulator: Goldberg plus a rewritten
  // steam_appid fight it (failed to load OnlineFix64.dll). Only clean Steam
  // builds get the per-instance Steam split; OFME stays local-only.
  if (!System.IO.File.Exists(Context.OrigRootFolder + "\\OnlineFix64.dll")) {
    Game.UseGoldberg = true;
    Game.CreateSteamAppIdByExe = true;
  } else {
    Game.UseGoldberg = false;
    Game.CreateSteamAppIdByExe = false;
  }

  // Per-instance Waygate hero: the server seats by character name, so a shared
  // PlayerCharacter gets the second join refused. The config is symlinked and
  // shared, so each instance first replaces its link with a real copy, then
  // takes the PlayerID-th hero alphabetically from its isolated saves (falls
  // back to the shared value when fewer heroes exist than players).
  var waygateOrigin = Context.OrigRootFolder + "\\BepInEx\\config\\com.humangenome.waygate.host.cfg";
  var waygateCfg = Context.GetFolder(Nucleus.Folder.InstancedGameFolder) + "\\BepInEx\\config\\com.humangenome.waygate.host.cfg";
  if (System.IO.File.Exists(waygateOrigin)) {
    System.IO.File.Copy(waygateOrigin, waygateCfg, true);
    var waygateLines = [];
    waygateLines.push(Context.FindLineNumberInTextFile(waygateCfg, "AutoConnect =", Nucleus.SearchType.StartsWith) + "|AutoConnect = true");
    var heroesRoot = Context.NucleusUserRoot + "\\AppData\\LocalLow\\Mudtek\\Dimraeth\\Characters";
    if (System.IO.Directory.Exists(heroesRoot)) {
      var heroFiles = System.IO.Directory.GetFiles(heroesRoot, "*.jrf").filter(function (f) {
        return /\.jrf$/i.test(f);
      }).sort();
      if (heroFiles.length > 0) {
        var heroPath = heroFiles[Math.min(Context.PlayerID, heroFiles.length - 1)];
        var heroFile = heroPath.substring(heroPath.lastIndexOf("\\") + 1);
        var heroName = heroFile.replace(/\.jrf$/i, "");
        waygateLines.push(Context.FindLineNumberInTextFile(waygateCfg, "PlayerCharacter =", Nucleus.SearchType.StartsWith) + "|PlayerCharacter = " + heroName);
      }
    }
    Context.ReplaceLinesInTextFile(waygateCfg, waygateLines);
    // TEMP-DIAG(hero-split): remove once per-instance heroes are verified.
    System.IO.File.AppendAllText("C:\\Users\\OmarPc\\AppData\\Local\\Temp\\opencode\\dimraeth-play.log",
      "playerID=" + Context.PlayerID + " heroesFound=" + (typeof heroFiles !== "undefined" && heroFiles ? heroFiles.join("|") : "none") + " wrote=" + waygateLines.join("|") + "\r\n");
  }
  var dllPath = Context.GetFolder(Nucleus.Folder.InstancedGameFolder) + "\\UnityPlayer.dll";
  var searchPattern =
    "57 00 69 00 6E 00 64 00 6F 00 77 00 73 00 2E 00 47 00 61 00 6D 00 69 00 6E 00 67 00 2E 00 49 00 6E 00 70 00 75 00 74 00 2E 00 47 00 61 00 6D 00 65 00 70 00 61 00 64";
  var patchPattern =
    "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00";
  Context.PatchFileFindPattern(dllPath, dllPath, searchPattern, patchPattern, true);
  Context.StartArguments =
    " -screen-fullscreen 0 -popupwindow -screen-width " +
    Context.Width +
    " -screen-height " +
    Context.Height +
    " -screen-quality Fastest";

  // Prevent Unity's saved fullscreen state from overriding Nucleus placement.
  var registryPath = "SOFTWARE\\Mudtek\\Dimraeth";
  Context.EditRegKey("HKEY_CURRENT_USER", registryPath, "Screenmanager Fullscreen mode_h3630240806", 3, Nucleus.RegType.DWord);
  Context.EditRegKey("HKEY_CURRENT_USER", registryPath, "Screenmanager Resolution Use Native_h1405027254", 0, Nucleus.RegType.DWord);
  Context.EditRegKey("HKEY_CURRENT_USER", registryPath, "Screenmanager Resolution Width_h182942802", Context.Width, Nucleus.RegType.DWord);
  Context.EditRegKey("HKEY_CURRENT_USER", registryPath, "Screenmanager Resolution Height_h2627697771", Context.Height, Nucleus.RegType.DWord);
  Context.EditRegKey("HKEY_CURRENT_USER", registryPath, "Screenmanager Window Position X_h4088080503", Context.PosX, Nucleus.RegType.DWord);
  Context.EditRegKey("HKEY_CURRENT_USER", registryPath, "Screenmanager Window Position Y_h4088080502", Context.PosY, Nucleus.RegType.DWord);
};
