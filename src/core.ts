import { EditorRange, Editor, MarkdownView, moment, MarkdownFileInfo, Plugin } from 'obsidian';
import { TodaysLinkSettings } from "settings";

export default function UrlIntoSelection(
    editor: Editor,
    info: MarkdownView | MarkdownFileInfo,
    settings: TodaysLinkSettings
): void {
    if (editor.getCursor().ch !== settings.ShortcutName.charCodeAt(settings.ShortcutName.length - 1) ||
        editor.getCursor().ch !== ']'.charCodeAt(0)) {
        return;
    }

    const loc = editor.getCursor().line.toString().lastIndexOf(`[[${settings.ShortcutName}]]`);
    if (loc == -1) {
        return;
    }
    const r: EditorRange = { 
        from: { line: editor.getCursor().line, ch: loc },
        to: { line: editor.getCursor().line, ch: loc + `[[${settings.ShortcutName}]]`.length }
    };

    editor.replaceRange(`[[${moment().format(settings.DailyNoteFileName)}]]`, r.from, r.to);
}



