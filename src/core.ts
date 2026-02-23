import { App, EditorRange, Editor, MarkdownView, moment, MarkdownFileInfo, Plugin } from 'obsidian';
import { TodaysLinkSettings } from "settings";

export function GetAndSetDailyNotesFormat(app: App, settings: TodaysLinkSettings){
    // TODO: add an option to override the DailyNoteFileName
    const dailyNotesPlugin = app.internalPlugins?.getPluginById?.("daily-notes");
    if(!dailyNotesPlugin || !dailyNotesPlugin?.enabled){
        throw new Error("TodaysLink: Daily Notes core plugin is not enabled. Disabling plugin.");
    }
    const instance = dailyNotesPlugin?.instance;
    const format = instance?.getFormat() as string | undefined;
    if(!format){
        throw new Error("TodaysLink: Daily Notes doesn't have date format. Disabling plugin.");
    }
    settings.DailyNoteFileName = format.includes("/") 
        ? format.substring(format.lastIndexOf("/") + 1) 
        : format; // get the note name from DN format
}

export function UrlIntoSelection(
    editor: Editor,
    info: MarkdownView | MarkdownFileInfo,
    settings: TodaysLinkSettings
): void {
    const cursor = editor.getCursor();
    const lastCursorChar = editor.getRange({ line: cursor.line, ch: cursor.ch - 1 }, cursor).charCodeAt(0);
    // TODO: this can be precalculated
    const lastLinkChar = settings.ShortcutName.charCodeAt(settings.ShortcutName.length - 1);

    // We have to be [[today|]]
    // TODO: support  [[today]|] and [[today]]|
    if (lastCursorChar !== lastLinkChar) {
        return;
    }
    const todayLinkRange: EditorRange = {
        from: { line: cursor.line, ch: cursor.ch - `[[${settings.ShortcutName}`.length },
        to: { line: cursor.line, ch: cursor.ch + 2 }
    };
    const loc = editor.getLine(cursor.line).lastIndexOf(`[[${settings.ShortcutName}]]`);
    if (loc == -1) {
        return;
    } else if (loc != todayLinkRange.from.ch) {
        console.error("Expected in-file location of todays-link shortcut invalid.");
    }
    const todaysLinkStr = `[[${moment().format(settings.DailyNoteFileName)}]]`;
    editor.replaceRange(todaysLinkStr, todayLinkRange.from, todayLinkRange.to);
    editor.setCursor({line: cursor.line, ch: todayLinkRange.from.ch + todaysLinkStr.length});
}

