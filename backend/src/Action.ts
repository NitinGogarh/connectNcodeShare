type Tactions = {
    JOIN:string,
    JOINED:string,
    DISCONNECTED:string,
    CODE_CHANGE:string,
    SYNC_CODE:string,
    LEAVE:string,
    LANG_CHANGE:string,
    INPUT_CHANGE:string,
    OUTPUT_CHANGE:string,
    SET_LOADING:string,
    SEND_MSG:string,
    RECEIVE_MSG:string
   }
   export const ACTIONS:Tactions = {
       JOIN:'join',
       JOINED:'joined',
       DISCONNECTED:'disconnected',
       CODE_CHANGE:'code-change',
       SYNC_CODE:'sync-code',
       LEAVE:'leave',
       LANG_CHANGE:"lang_change",
       INPUT_CHANGE:'input',
       OUTPUT_CHANGE:"output",
       SEND_MSG:"send-msg",
       RECEIVE_MSG:"receive-msg",
       SET_LOADING:"set-loading"
   }