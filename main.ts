import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

const fs = require('fs');
const path = require('path');


interface TaskListGeneratorSettings {
	tasksRoot: string,
	outputNote: string
}

const DEFAULT_SETTINGS: TaskListGeneratorSettings= {
	tasksRoot: 'ToDo',
	outputNote: 'Task List.md'
}

export default class TaskListGenerator extends Plugin {

	settings:TaskListGeneratorSettings

    async onload() {
		await this.loadSettings();
        this.addCommand({
            id: 'update-task-list',
            name: 'Update Task List',
            callback: this.updateTaskList.bind(this),
        });
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TaskListGeneratorSettingsTab(this.app, this));
    }

    async updateTaskList() {
        const vault = this.app.vault;
        const vaultRoot = vault.adapter.getBasePath();// get the root directory of the vault
        const taskDir = path.join(vaultRoot, this.settings.tasksRoot);  
        const outputNote = this.settings.outputNote;  // replace with your note

        // get a list of all markdown files in the directory
        const noteFiles = fs.readdirSync(taskDir).filter(f => f.endsWith('.md'));

        // remove the .md extension from the filenames
        const noteTitles = noteFiles.map(f => path.basename(f, '.md'));

        // create a list with checkboxes
        const noteList = noteTitles.map(title => `- [ ] [[${title}]]`).join('\n');

        // write the list to the output note

		console.log(outputNote);
		const outputNoteFile = vault.getAbstractFileByPath(outputNote);

		console.log(outputNoteFile);

        await vault.modify(outputNoteFile, noteList);
    }

	

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class TaskListGeneratorSettingsTab extends PluginSettingTab {
	plugin: TaskListGenerator;

	constructor(app: App, plugin: TaskListGenerator) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h2', {text: 'Configuration'});

		new Setting(containerEl)
			.setName('Tasks Root Folder')
			.setDesc('Root folder of the tasks')
			.addText(text => text
				.setPlaceholder('')
				.setValue(this.plugin.settings.tasksRoot)
				.onChange(async (value) => {
					console.log('TaskRoot Set to: ' + value);
					this.plugin.settings.tasksRoot = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(containerEl)
			.setName('Destination Note')
			.setDesc('Name of the destination Note')
			.addText(text => text
				.setPlaceholder('')
				.setValue(this.plugin.settings.outputNote)
				.onChange(async (value) => {
					console.log('Destination Note Set to: ' + value);
					this.plugin.settings.outputNote = value;
					await this.plugin.saveSettings();
				}));
	}
}
/*
export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
*/
