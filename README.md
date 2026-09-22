# Dimraeth Nucleus Co-op Handler

Community beta handler for running multiple local instances of [Dimraeth](https://store.steampowered.com/app/2402680/Dimraeth/) through [Nucleus Co-op](https://nucleus-coop.github.io/).

## Status

- Verified with two independently controlled gamepad instances in gameplay.
- Configured for up to four players, with at most two players per monitor.
- Four-player runtime stability has not been verified.
- Generic DirectInput controllers were tested through x360ce v4 as separate XInput slots.
- Mixed controller and keyboard input was verified. Locked mouse buttons and wheel remain unresolved.
- Clean, current Steam-build validation is still required before requesting official Handlers Hub acceptance.

## Requirements

- Dimraeth
- Nucleus Co-op 2.4.2 (tested version)
- One distinct XInput slot per controller player
- x360ce v4 kept running when converting generic DirectInput controllers

## Install

1. Download `Dimraeth.js` from this repository.
2. Copy it into the Nucleus Co-op `handlers` directory.
3. Start Nucleus Co-op and select the Dimraeth executable when prompted.
4. If using generic DirectInput controllers, map each controller to a different XInput slot in x360ce v4 and leave x360ce running.
5. Assign each input device to a player and start the session.
6. For keyboard/mouse players, press `End` to lock input after all instances start. Press `End` again before ending the session with `Ctrl+Q`.

The handler starts each instance at `1280x720` with Unity's `Fastest` quality setting to reduce multi-instance memory pressure.

## Isolation

Nucleus copies `UnityPlayer.dll` into each temporary instance and disables Unity's Windows Gaming Input gamepad backend in that copy. ProtoInput then exposes only the assigned XInput slot to each instance. The installed game file is not modified.

Each instance also receives an isolated LocalLow save directory through Nucleus.

## Known Limitations

- Locked mouse buttons and wheel do not currently reach the game reliably.
- Four simultaneous instances require further gameplay and memory testing.
- Higher graphics settings can exhaust memory when multiple instances run.
- Official Handlers Hub publication depends on clean Steam-build validation and Nucleus maintainer review.

## Tests

```powershell
node --check .\Dimraeth.js
node --check .\tests\Test-DimraethInputLock.js
node .\tests\Test-DimraethInputLock.js
pwsh -NoProfile -File .\tests\Test-DimraethNucleusHandler.ps1
```

## Community

- [Nucleus Co-op Handlers Hub](https://hub.splitscreen.me/)
- [Nucleus Co-op Discord](https://discord.gg/QDUt8HpCvr)
- [Dimraeth Discord](https://discord.gg/dimraeth)
- [Dimraeth Steam Discussions](https://steamcommunity.com/app/2402680/discussions/)

This is an unofficial community project and is not affiliated with Mudtek or the Nucleus Co-op maintainers.
