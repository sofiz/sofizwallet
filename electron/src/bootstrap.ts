import { app } from "electron"

// Quick-fix for "io.sofizwallet.app" being shown in Mac app menu
app.name = "sofiz Wallet"

// Needs to match the value in electron-build.yml
app.setAppUserModelId("io.sofizwallet.app")

// Disabled until we actually ship SEP-7 support
// app.setAsDefaultProtocolClient("web+stellar")
