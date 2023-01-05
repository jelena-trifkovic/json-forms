
enum QuestionType {
    Object = 'Object',
    Text = 'Text',
    YesNo = 'YesNo',
    Date = 'Date',
    Checkboxes = 'Checkboxes',
    Select = 'Select',
}

export type Question =
    | ObjectQuestion
    | YesNoQuestion
    | TextQuestion
    | DateQuestion
    | CheckboxesQuestion
    | SelectQuestion;

export interface ObjectQuestion {
    type: QuestionType.Object;
    props: {
        fields: {
            [key: string]: Question;
        };
        optional?: boolean;
    };
}

export interface TextQuestion {
    type: QuestionType.Text;
    props: {
        label: string;
        optional?: boolean;
    };
}

export interface DateQuestion {
    type: QuestionType.Date;
    props: {
        label: string;
        optional?: boolean;
    };
}

export interface YesNoQuestion {
    type: QuestionType.YesNo;
    props: {
        label: string;
        ifYes?: Question;
        ifNo?: Question;
        optional?: boolean;
    };
}

export type Checkbox = {
    name: string;
    label: string;
};

export interface CheckboxesQuestion {
    type: QuestionType.Checkboxes;
    props: {
        label: string;
        checkboxes: Checkbox[];
        optional?: boolean;
    };
}

export type Option = {
    name: string;
    label: string;
};

export interface SelectQuestion {
    type: QuestionType.Select;
    props: {
        label: string;
        options: Option[];
        optional?: boolean;
    };
}