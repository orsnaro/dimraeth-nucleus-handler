[CmdletBinding()]
param(
    [string]$HandlerPath = (Join-Path $PSScriptRoot '..\Dimraeth.js')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Throws when required handler text is absent.
function Assert-Contains {
    param([string]$Content, [string]$Expected)
    if (-not $Content.Contains($Expected, [StringComparison]::Ordinal)) {
        throw "ASSERT FAILED: missing '$Expected'"
    }
}

# Throws when forbidden handler text is present.
function Assert-Excludes {
    param([string]$Content, [string]$Forbidden)
    if ($Content.Contains($Forbidden, [StringComparison]::OrdinalIgnoreCase)) {
        throw "ASSERT FAILED: forbidden '$Forbidden'"
    }
}

if (-not (Test-Path -LiteralPath $HandlerPath -PathType Leaf)) {
    throw "ASSERT FAILED: handler does not exist: $HandlerPath"
}

$content = [IO.File]::ReadAllText($HandlerPath)

foreach ($expected in @(
    'Game.ExecutableContext = ["Dimraeth_Data"];',
    'Game.ExecutableName = "Dimraeth.exe";',
    'Game.GUID = "Dimraeth";',
    'Game.MaxPlayers = 4;',
    'Game.FileSymlinkCopyInstead = ["UnityPlayer.dll"];',
    'Game.MaxPlayersOneMonitor = 2;',
    'Game.Hook.DInputEnabled = false;',
    'Game.Hook.XInputEnabled = false;',
    'Game.Hook.XInputReroute = false;',
    'Game.Hook.CustomDllEnabled = false;',
    'Game.ProtoInput.XinputHook = true;',
    'Game.ProtoInput.UseOpenXinput = true;',
    'Context.GetFolder(Nucleus.Folder.InstancedGameFolder) + "\\UnityPlayer.dll";',
    'Context.PatchFileFindPattern(dllPath, dllPath, searchPattern, patchPattern, true);',
    '57 00 69 00 6E 00 64 00 6F 00 77 00 73 00 2E 00 47 00 61 00 6D 00 69 00 6E 00 67 00 2E 00 49 00 6E 00 70 00 75 00 74 00 2E 00 47 00 61 00 6D 00 65 00 70 00 61 00 64',
    'if (player.IsXInput) {',
    'Game.SymlinkGame = true;',
    'Game.UserProfileSavePath = "AppData\\LocalLow\\Mudtek";',
    'Game.SupportsMultipleKeyboardsAndMice = true;',
    'Game.ProtoInput.InjectRuntime_RemoteLoadMethod = true;',
    'Game.ProtoInput.InjectRuntime_EasyHookMethod = false;',
    'Game.ProtoInput.EnableFocusMessageLoop = true;',
    'Game.ProtoInput.OnInputLocked = function',
    'Game.ProtoInput.OnInputUnlocked = function',
    'InstallHook',
    'EnableMessageFilter',
    'SetRawInputBypass',
    'SetDrawFakeCursor',
    'Game.ProtoInput.ExtendFakeCursorBounds = true;',
    'Game.LockInputToggleKey = 0x23;',
    '-screen-fullscreen 0 -popupwindow',
    '-screen-width 1280',
    '-screen-height 720',
    '-screen-quality Fastest'
)) {
    Assert-Contains -Content $content -Expected $expected
}

foreach ($forbidden in @(
    'Game.ProtoInput.MultipleProtoControllers',
    'Game.KillMutex',
    'Context.PatchFile(',
    'Context.EditRegKey'
)) {
    Assert-Excludes -Content $content -Forbidden $forbidden
}

'Dimraeth Nucleus handler checks passed.'
