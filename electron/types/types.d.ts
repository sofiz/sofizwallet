interface ElectronIPCCallMessage<Message extends keyof IPC.MessageType> {
  args: IPC.MessageArgs<Message>
  callID: number
}

interface ElectronIPCCallErrorMessage {
  callID: number
  error: Error
}

interface ElectronIPCCallResultMessage {
  callID: number
  result: any
}

type ElectronIPCCallResponseMessage = ElectronIPCCallErrorMessage | ElectronIPCCallResultMessage

interface ElectronContext {
  sendIPCMessage<Message extends keyof IPC.MessageType>(
    messageType: Message,
    message: ElectronIPCCallMessage<Message>
  ): Promise<any>
  subscribeToIPCMessages<Message extends keyof IPC.MessageType>(
    messageType: Message,
    subscribeCallback: (event: Event, result: IPC.MessageReturnType<Message>) => void
  ): () => void
}

interface Window {
  // Will only be defined when in an electron build
  electron?: ElectronContext
}

declare module NodeJS {
  interface Global {
    // Will only be defined when in an electron build
    electron?: ElectronContext
    process: NodeJS.Process
  }
}

declare module "electron-reload" {
  export default function autoReload(
    paths: string,
    options?: { electron?: string; argv?: string[]; hardResetMethod?: "exit"; forceHardReset?: boolean }
  ): void
}
// added by sofiz
declare namespace IPC {
  /**
   * Those are the messages (commands) that you can send either from React app
   * to platform code or vice versa. Many messages provoke a callback
   * message – we don't need to define message types for them as they
   * reference the call itself (each call is assigned a numeric call ID).
   */

  const Messages: {
    CopyToClipboard: "CopyToClipboard"

    ScanQRCode: "ScanQRCode"

    ShowSplashScreen: "ShowSplashScreen"
    HideSplashScreen: "HideSplashScreen"

    BioAuthAvailable: "BioAuthAvailable"
    TestBioAuth: "TestBioAuth"

    NotificationPermission: "NotificationPermission"
    RequestNotificationPermission: "RequestNotificationPermission"
    ShowNotification: "ShowNotification"

    OpenLink: "OpenLink"

    DeepLinkURL: "DeepLinkURL"

    CheckUpdateAvailability: "CheckUpdateAvailability"
    StartUpdate: "StartUpdate"

    ReadSettings: "ReadSettings"
    StoreSettings: "StoreSettings"
    ReadIgnoredSignatureRequestHashes: "ReadIgnoredSignatureRequestHashes"
    StoreIgnoredSignatureRequestHashes: "StoreIgnoredSignatureRequestHashes"

    GetKeyIDs: "GetKeyIDs"
    GetPublicKeyData: "GetPublicKeyData"
    GetPrivateKeyData: "GetPrivateKeyData"
    SaveKey: "SaveKey"
    SavePublicKeyData: "SavePublicKeyData"
    SignTransaction: "SignTransaction"
    RemoveKey: "RemoveKey"
  }

  export type MessageType = typeof Messages

  export interface MessageSignatures {
    [Messages.CopyToClipboard]: (text: string) => void

    [Messages.ScanQRCode]: () => string

    [Messages.ShowSplashScreen]: () => void
    [Messages.HideSplashScreen]: () => void

    [Messages.BioAuthAvailable]: () => BiometricAvailability
    [Messages.TestBioAuth]: () => string | undefined

    [Messages.NotificationPermission]: () => NotificationPermission
    [Messages.RequestNotificationPermission]: () => boolean
    [Messages.ShowNotification]: (notification: LocalNotification) => void

    [Messages.OpenLink]: (href: string) => void

    [Messages.DeepLinkURL]: () => string

    [Messages.CheckUpdateAvailability]: () => boolean
    [Messages.StartUpdate]: () => void

    [Messages.ReadSettings]: () => Partial<Platform.SettingsData>
    [Messages.StoreSettings]: (updatedSettings: Partial<Platform.SettingsData>) => boolean
    [Messages.ReadIgnoredSignatureRequestHashes]: () => string[]
    [Messages.StoreIgnoredSignatureRequestHashes]: (updatedHashes: string[]) => boolean

    [Messages.GetKeyIDs]: () => string[]
    [Messages.GetPublicKeyData]: (keyID: string) => PublicKeyData
    [Messages.GetPrivateKeyData]: (keyID: string, password: string) => PrivateKeyData
    [Messages.SaveKey]: (
      keyID: string,
      password: string,
      privateData: PrivateKeyData,
      publicData: PublicKeyData | undefined
    ) => void
    [Messages.SavePublicKeyData]: (keyID: string, publicData: PublicKeyData) => void
    [Messages.SignTransaction]: (internalAccountID: string, transactionXDR: string, password: string) => string
    [Messages.RemoveKey]: (keyID: string) => void
  }

  export type MessageArgs<Message extends keyof MessageType> = MessageSignatures[Message] extends () => any
    ? []
    : MessageSignatures[Message] extends (arg0: infer Arg0) => any
    ? [Arg0]
    : MessageSignatures[Message] extends (arg0: infer Arg0, arg1: infer Arg1) => any
    ? [Arg0, Arg1]
    : MessageSignatures[Message] extends (arg0: infer Arg0, arg1: infer Arg1, arg2: infer Arg2) => any
    ? [Arg0, Arg1, Arg2]
    : MessageSignatures[Message] extends (arg0: infer Arg0, arg1: infer Arg1, arg2: infer Arg2, arg3: infer Arg3) => any
    ? [Arg0, Arg1, Arg2, Arg3]
    : never

  export type MessageReturnType<Message extends keyof MessageType> = ReturnType<MessageSignatures[Message]>
}

declare interface PrivateKeyData {
  privateKey: string
}

declare interface PublicKeyData {
  cosignerOf?: string
  name: string
  password: boolean
  publicKey: string
  testnet: boolean
}

declare namespace Platform {
  export interface SettingsData {
    agreedToTermsAt?: string
    biometricLock: boolean
    hideMemos: boolean
    multisignature: boolean
    testnet: boolean
    trustedServices: TrustedService[]
  }
}
