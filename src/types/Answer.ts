import {
    CheckboxesQuestion,
    DateQuestion,
    ObjectQuestion,
    Option,
    Question,
    SelectQuestion,
    TextQuestion,
    YesNoQuestion,
  } from './Question';
  
  export type Answer<Question> = Question extends ObjectQuestion
    ? ObjectAnswer<Question>
    : Question extends YesNoQuestion
    ? YesNoAnswer
    : Question extends TextQuestion
    ? TextAnswer
    : Question extends DateQuestion
    ? DateAnswer
    : Question extends CheckboxesQuestion
    ? CheckboxesAnswer
    : Question extends SelectQuestion
    ? SelectAnswer
    : any;
  
  export type ObjectAnswer<Question extends ObjectQuestion> = {
    [key in keyof Question['props']['fields']]: Answer<Question['props']['fields'][key]>;
  };
  
  export interface YesNoAnswerWithChildren {
    value: boolean;
    ifYes?: Answer<Question>;
    ifNo?: Answer<Question>;
  }
  
  export type YesNoAnswer = boolean | YesNoAnswerWithChildren;
  
  export type TextAnswer = string;
  export type DateAnswer = string;
  
  export type CheckboxesAnswer = { [name: string]: boolean };
  export type SelectAnswer = Option | null;
  