import {App, Editor, MarkdownView, moment, MarkdownFileInfo, Plugin} from 'obsidian';
import {UrlIntoSelection} from 'core';
import {DEFAULT_SETTINGS, TodaysLinkSettings, TodaysLinkSettingsTab} from "./settings";

export default class TodaysLinkObsidian extends Plugin {
	settings: TodaysLinkSettings;

	todayLinkReplaceHandler = (editor: Editor, info: MarkdownView | MarkdownFileInfo) =>
		ReplaceTodaysLink(editor, info, this.settings);

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TodaysLinkSettingsTab(this.app, this));

        const dailyNotesPlugin = this.app.internalPlugins.getPluginById("daily-notes");
		const instance = dailyNotesPlugin.instance;
		const format = instance.getFormat() ?? "YYYY-MM-DD";
		this.settings.DailyNoteFileName = format.includes("/") 
			? format.substring(format.lastIndexOf("/") + 1) 
			: format; // get the note name from DN format

        if (!dailyNotesPlugin?.enabled) {
            console.warn("TodaysLink: Daily Notes core plugin is not enabled. Disabling plugin.");
            return; // bail out early — no commands or listeners registered
        }

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'add-todays-link-at-cursor',
			name: 'Add link to today\'s daily note at cursor',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.processLines(
					(line, lineText) => line === editor.getCursor().line ? lineText : null,
					(line, lineText, value) => {
						if (value === null) return;
						const ch = editor.getCursor().ch;
						return {
							from: { line, ch },
							to: { line, ch },
							text: `[[${moment().format(this.settings.DailyNoteFileName)}]]`
						};
					}
				);
			}
		});

		// this.app.workspace.on("editor-change", this.todayLinkReplaceHandler);
	}

	onunload() {
		// this.app.workspace.off("editor-change", this.todayLinkReplaceHandler);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<TodaysLinkSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
