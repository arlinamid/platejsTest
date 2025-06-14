'use client';

import { useEffect, useMemo } from 'react';

import { type SlateEditor, NodeApi } from '@udecode/plate';
import { AIChatPlugin, AIPlugin } from '@udecode/plate-ai/react';
import { useIsSelecting } from '@udecode/plate-selection/react';
import {
  type PlateEditor,
  useEditorRef,
  usePluginOption,
} from '@udecode/plate/react';
import {
  Album,
  BadgeHelp,
  BookOpen,
  Briefcase,
  Check,
  CornerUpLeft,
  Crown,
  FeatherIcon,
  GraduationCap,
  Heart,
  ListEnd,
  ListMinus,
  ListPlus,
  MessageSquare,
  Newspaper,
  PenLine,
  Rocket,
  Scale,
  SmileIcon,
  Sparkles,
  Target,
  Users,
  Wand,
  X,
  Zap,
} from 'lucide-react';

import { CommandGroup, CommandItem } from './command';

export type EditorChatState =
  | 'cursorCommand'
  | 'cursorSuggestion'
  | 'selectionCommand'
  | 'selectionSuggestion';

export const aiChatItems = {
  accept: {
    icon: <Check />,
    label: 'Accept',
    value: 'accept',
    onSelect: ({ editor }) => {
      editor.getTransforms(AIChatPlugin).aiChat.accept();
      editor.tf.focus({ edge: 'end' });
    },
  },
  academicWriting: {
    icon: <GraduationCap />,
    label: 'Academic & Scholarly',
    value: 'academicWriting',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Rewrite this in an academic style. Use formal language, precise terminology, and structured arguments. Maintain objectivity and scholarly tone.',
      });
    },
  },
  addEmotionalTone: {
    icon: <Heart />,
    label: 'Add emotional depth',
    value: 'addEmotionalTone',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Enhance this writing by adding emotional depth and resonance. Include sensory details and emotional language that connects with readers.',
      });
    },
  },
  addExamples: {
    icon: <Users />,
    label: 'Add examples & details',
    value: 'addExamples',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Enhance this by adding relevant examples, specific details, and concrete illustrations to make the points clearer and more relatable.',
      });
    },
  },
  businessWriting: {
    icon: <Briefcase />,
    label: 'Business & Professional',
    value: 'businessWriting',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Rewrite this in a professional business style. Use clear, concise language appropriate for corporate communication. Maintain formality while being engaging.',
      });
    },
  },
  conversationalTone: {
    icon: <MessageSquare />,
    label: 'Conversational',
    value: 'conversationalTone',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Rewrite this in a friendly, conversational tone. Use natural language, contractions, and a warm, approachable style as if talking to a friend.',
      });
    },
  },
  continueWrite: {
    icon: <PenLine />,
    label: 'Continue writing',
    value: 'continueWrite',
    onSelect: ({ editor }) => {
      const ancestorNode = editor.api.block({ highest: true });

      if (!ancestorNode) return;

      const isEmpty = NodeApi.string(ancestorNode[0]).trim().length === 0;

      void editor.getApi(AIChatPlugin).aiChat.submit({
        mode: 'insert',
        prompt: isEmpty
          ? `<Document>
{editor}
</Document>
Start writing a new paragraph AFTER <Document> ONLY ONE SENTENCE`
          : 'Continue writing AFTER <Block> ONLY ONE SENTENCE. DONT REPEAT THE TEXT.',
      });
    },
  },
  creativeWriting: {
    icon: <Sparkles />,
    label: 'Creative & Engaging',
    value: 'creativeWriting',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Rewrite this with creative flair. Use vivid imagery, engaging metaphors, and dynamic language to make it more compelling and memorable.',
      });
    },
  },
  discard: {
    icon: <X />,
    label: 'Discard',
    shortcut: 'Escape',
    value: 'discard',
    onSelect: ({ editor }) => {
      editor.getTransforms(AIPlugin).ai.undo();
      editor.getApi(AIChatPlugin).aiChat.hide();
    },
  },
  emojify: {
    icon: <SmileIcon />,
    label: 'Emojify',
    value: 'emojify',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Emojify',
      });
    },
  },
  explain: {
    icon: <BadgeHelp />,
    label: 'Explain',
    value: 'explain',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: {
          default: 'Explain {editor}',
          selecting: 'Explain',
        },
      });
    },
  },
  fixSpelling: {
    icon: <Check />,
    label: 'Fix spelling & grammar',
    value: 'fixSpelling',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Fix spelling and grammar',
      });
    },
  },
  improveFlow: {
    icon: <Crown />,
    label: 'Improve flow & transitions',
    value: 'improveFlow',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Improve the flow and transitions in this text. Add smooth connections between ideas and ensure logical progression throughout.',
      });
    },
  },
  improveWriting: {
    icon: <Wand />,
    label: 'Improve writing',
    value: 'improveWriting',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Improve the writing while maintaining the original tone and meaning. Focus on clarity, flow, and engagement.',
      });
    },
  },
  insertBelow: {
    icon: <ListEnd />,
    label: 'Insert below',
    value: 'insertBelow',
    onSelect: ({ aiEditor, editor }) => {
      void editor.getTransforms(AIChatPlugin).aiChat.insertBelow(aiEditor);
    },
  },
  journalismStyle: {
    icon: <Newspaper />,
    label: 'Journalistic',
    value: 'journalismStyle',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Rewrite this in journalistic style. Use clear, factual language with strong leads, concise paragraphs, and objective reporting tone.',
      });
    },
  },
  legalStyle: {
    icon: <Scale />,
    label: 'Legal & Formal',
    value: 'legalStyle',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Rewrite this in formal legal style. Use precise legal terminology, structured arguments, and formal language appropriate for legal documents.',
      });
    },
  },
  makeLonger: {
    icon: <ListPlus />,
    label: 'Make longer',
    value: 'makeLonger',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Make longer',
      });
    },
  },
  makeMoreConcise: {
    icon: <Rocket />,
    label: 'Make more concise',
    value: 'makeMoreConcise',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Make this more concise and impactful. Remove unnecessary words, combine related ideas, and strengthen the core message.',
      });
    },
  },
  makeShorter: {
    icon: <ListMinus />,
    label: 'Make shorter',
    value: 'makeShorter',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Make shorter',
      });
    },
  },
  persuasiveWriting: {
    icon: <Target />,
    label: 'Persuasive & Compelling',
    value: 'persuasiveWriting',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Rewrite this to be more persuasive and compelling. Use strong arguments, emotional appeals, and convincing language to influence the reader.',
      });
    },
  },
  replace: {
    icon: <Check />,
    label: 'Replace selection',
    value: 'replace',
    onSelect: ({ aiEditor, editor }) => {
      void editor.getTransforms(AIChatPlugin).aiChat.replaceSelection(aiEditor);
    },
  },
  simplifyLanguage: {
    icon: <FeatherIcon />,
    label: 'Simplify language',
    value: 'simplifyLanguage',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Simplify the language',
      });
    },
  },
  summarize: {
    icon: <Album />,
    label: 'Add a summary',
    value: 'summarize',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        mode: 'insert',
        prompt: {
          default: 'Summarize {editor}',
          selecting: 'Summarize',
        },
      });
    },
  },
  storytellingStyle: {
    icon: <BookOpen />,
    label: 'Storytelling',
    value: 'storytellingStyle',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Rewrite this as a compelling story. Use narrative techniques, character development, and engaging plot structure to make it more captivating.',
      });
    },
  },
  technicalWriting: {
    icon: <Zap />,
    label: 'Technical & Precise',
    value: 'technicalWriting',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.submit({
        prompt: 'Rewrite this in technical writing style. Use precise terminology, clear step-by-step explanations, and logical structure for technical accuracy.',
      });
    },
  },
  tryAgain: {
    icon: <CornerUpLeft />,
    label: 'Try again',
    value: 'tryAgain',
    onSelect: ({ editor }) => {
      void editor.getApi(AIChatPlugin).aiChat.reload();
    },
  },
} satisfies Record<
  string,
  {
    icon: React.ReactNode;
    label: string;
    value: string;
    component?: React.ComponentType<{ menuState: EditorChatState }>;
    filterItems?: boolean;
    items?: { label: string; value: string }[];
    shortcut?: string;
    onSelect?: ({
      aiEditor,
      editor,
    }: {
      aiEditor: SlateEditor;
      editor: PlateEditor;
    }) => void;
  }
>;

const menuStateItems: Record<
  EditorChatState,
  {
    items: (typeof aiChatItems)[keyof typeof aiChatItems][];
    heading?: string;
  }[]
> = {
  cursorCommand: [
    {
      heading: 'Content Creation',
      items: [
        aiChatItems.continueWrite,
        aiChatItems.summarize,
        aiChatItems.explain,
      ],
    },
    {
      heading: 'Expert Writing',
      items: [
        aiChatItems.businessWriting,
        aiChatItems.creativeWriting,
        aiChatItems.conversationalTone,
        aiChatItems.academicWriting,
      ],
    },
  ],
  cursorSuggestion: [
    {
      items: [aiChatItems.accept, aiChatItems.discard, aiChatItems.tryAgain],
    },
  ],
  selectionCommand: [
    {
      heading: 'Quick Improvements',
      items: [
        aiChatItems.improveWriting,
        aiChatItems.fixSpelling,
        aiChatItems.simplifyLanguage,
        aiChatItems.emojify,
      ],
    },
    {
      heading: 'Writing Styles',
      items: [
        aiChatItems.businessWriting,
        aiChatItems.conversationalTone,
        aiChatItems.academicWriting,
        aiChatItems.creativeWriting,
        aiChatItems.journalismStyle,
        aiChatItems.persuasiveWriting,
        aiChatItems.technicalWriting,
        aiChatItems.storytellingStyle,
        aiChatItems.legalStyle,
      ],
    },
    {
      heading: 'Content Enhancement',
      items: [
        aiChatItems.makeLonger,
        aiChatItems.makeShorter,
        aiChatItems.makeMoreConcise,
        aiChatItems.addEmotionalTone,
        aiChatItems.addExamples,
        aiChatItems.improveFlow,
      ],
    },
  ],
  selectionSuggestion: [
    {
      items: [
        aiChatItems.replace,
        aiChatItems.insertBelow,
        aiChatItems.discard,
        aiChatItems.tryAgain,
      ],
    },
  ],
};

export const AIMenuItems = ({
  setValue,
}: {
  setValue: (value: string) => void;
}) => {
  const editor = useEditorRef();
  const { messages } = usePluginOption(AIChatPlugin, 'chat');
  const aiEditor = usePluginOption(AIChatPlugin, 'aiEditor')!;
  const isSelecting = useIsSelecting();

  const menuState = useMemo(() => {
    if (messages && messages.length > 0) {
      return isSelecting ? 'selectionSuggestion' : 'cursorSuggestion';
    }

    return isSelecting ? 'selectionCommand' : 'cursorCommand';
  }, [isSelecting, messages]);

  const menuGroups = useMemo(() => {
    const items = menuStateItems[menuState];

    return items;
  }, [menuState]);

  useEffect(() => {
    if (menuGroups.length > 0 && menuGroups[0].items.length > 0) {
      setValue(menuGroups[0].items[0].value);
    }
  }, [menuGroups, setValue]);

  return (
    <>
      {menuGroups.map((group, index) => (
        <CommandGroup key={index} heading={group.heading}>
          {group.items.map((menuItem) => (
            <CommandItem
              key={menuItem.value}
              className="[&_svg]:text-muted-foreground"
              value={menuItem.value}
              onSelect={() => {
                menuItem.onSelect?.({
                  aiEditor,
                  editor: editor,
                });
              }}
            >
              {menuItem.icon}
              <span>{menuItem.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      ))}
    </>
  );
};
