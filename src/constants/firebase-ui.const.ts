import { GoogleAuthProvider } from "firebase/auth";
import { PATHS } from "./paths.const";

export const uiConfig = {
    // immediateFederatedRedirect: true,
    signInSuccessUrl: PATHS.POLL,
    // signOutSuccessUrl: PATHS.LOGIN,
    signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
    ],
    // Other configuration options here...
}