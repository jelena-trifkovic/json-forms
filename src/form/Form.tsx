import {
    CheckboxesQuestion,
    DateQuestion,
    ObjectQuestion,
    Question,
    SelectQuestion,
    TextQuestion,
    YesNoQuestion,
} from './types/Question';
import {
    Answer,
    CheckboxesAnswer,
    DateAnswer,
    ObjectAnswer,
    SelectAnswer,
    TextAnswer,
    YesNoAnswer,
    YesNoAnswerWithChildren,
} from './types/Answer';
import { cloneElement, ReactNode } from 'react';
import DateInput from './questions/DateInput';
import TextInput from './questions/TextInput';
import CheckboxesInput from './questions/CheckboxesInput';
import SelectInput from './questions/SelectInput';
import YesNoInput from './questions/YesNoInput';
import { isBoolean } from 'lodash';
import moment from 'moment';

export type ObjectQuestionChildren<T, Q extends ObjectQuestion> = { [key in keyof Q['props']['fields']]: T };
export type YesNoQuestionChildren<T> = { child: T | null };

export type Tags = {
    [key: string]: string;
};

type FormRendererSpec<T> = {
    renderObject<Q extends ObjectQuestion>(
        children: ObjectQuestionChildren<T, Q>,
        tags: Tags,
        question: Q['props'],
        answer?: Answer<Q>,
        onChange?: (newAnswer: Answer<Q>) => void
    ): T;
    renderYesNo<Q extends YesNoQuestion>(
        children: YesNoQuestionChildren<T>,
        tags: Tags,
        question: Q['props'],
        answer?: Answer<Q>,
        onChange?: (newAnswer: Answer<Q>) => void
    ): T;
    renderText<Q extends TextQuestion>(
        tags: Tags,
        question: Q['props'],
        answer?: Answer<Q>,
        onChange?: (newAnswer: Answer<Q>) => void
    ): T;
    renderCheckboxes<Q extends CheckboxesQuestion>(
        tags: Tags,
        question: Q['props'],
        answer?: Answer<Q>,
        onChange?: (newAnswer: Answer<Q>) => void
    ): T;
    renderSelect<Q extends SelectQuestion>(
        tags: Tags,
        question: Q['props'],
        answer?: Answer<Q>,
        onChange?: (newAnswer: Answer<Q>) => void
    ): T;
    renderDate<Q extends DateQuestion>(
        tags: Tags,
        question: Q['props'],
        answer?: Answer<Q>,
        onChange?: (newAnswer: Answer<Q>) => void
    ): T;
};

type FormRenderer<T, Q extends Question> = (
    tags: Tags,
    question?: Q,
    answer?: Answer<Q>,
    onChange?: (newAnswer: Answer<Q>) => void
) => T;
type FormRendererProvider<T> = (spec: FormRendererSpec<T>) => FormRenderer<T, Question>;

const provideFormRenderer: FormRendererProvider<ReactNode> = spec => (tags, question, answer, onChange) => {
    if (question) {
        switch (question.type) {
            case 'Object': {
                const children = Object.entries(question.props.fields).reduce((res, curr) => {
                    const [name, child] = curr;
                    return {
                        ...res,
                        [name]: provideFormRenderer(spec)(
                            tags,
                            child,
                            answer ? (answer as ObjectAnswer<ObjectQuestion>)[name] : undefined,
                            newAnswer => onChange?.(answer ? { ...(answer as object), [name]: newAnswer } : { [name]: newAnswer })
                        ),
                    };
                }, {});
                return spec.renderObject(children, tags, question.props, answer as ObjectAnswer<ObjectQuestion>);
            }
            case 'Text':
                return spec.renderText(tags, question['props'], answer as TextAnswer, onChange);
            case 'Checkboxes':
                return spec.renderCheckboxes(tags, question['props'], answer as CheckboxesAnswer, onChange);
            case 'Select':
                return spec.renderSelect(tags, question['props'], answer as SelectAnswer, onChange);
            case 'YesNo':
                const children = {
                    child:
                        question['props'].ifYes && (answer === true || (answer as YesNoAnswerWithChildren)?.value === true)
                            ? provideFormRenderer(spec)(
                                tags,
                                question['props'].ifYes,
                                answer ? (answer as YesNoAnswerWithChildren).ifYes : undefined,
                                newAnswer => {
                                    onChange?.(answer ? { ...(answer as object), ifYes: newAnswer } : { ifYes: newAnswer });
                                }
                            )
                            : question['props'].ifNo && (answer === false || (answer as YesNoAnswerWithChildren)?.value === false)
                                ? provideFormRenderer(spec)(
                                    tags,
                                    question['props'].ifNo,
                                    answer ? (answer as YesNoAnswerWithChildren).ifNo : undefined,
                                    newAnswer =>
                                        onChange?.(
                                            answer
                                                ? {
                                                    ...(answer as object),
                                                    ifNo: newAnswer,
                                                }
                                                : { ifNo: newAnswer }
                                        )
                                )
                                : null,
                };
                const onYesNoChange =
                    question['props'].ifYes || question['props'].ifNo
                        ? (newAnswer: YesNoAnswer) =>
                            onChange?.(answer ? { ...(answer as object), value: newAnswer } : { value: newAnswer })
                        : onChange;
                return spec.renderYesNo(children, tags, question['props'], answer as YesNoAnswer, onYesNoChange);
            case 'Date':
                return spec.renderDate(tags, question['props'], answer as DateAnswer, onChange);
        }
    }
    return undefined;
};

export const renderEditableFormUI = provideFormRenderer({
    renderDate(
        tags: Tags,
        question: DateQuestion['props'],
        answer: Answer<DateQuestion> | undefined,
        onChange
    ): ReactNode {
        return <DateInput {...question} answer={answer} onChange={onChange as (newAnswer: DateAnswer) => void} />;
    },
    renderText(
        tags: Tags,
        question: TextQuestion['props'],
        answer: Answer<TextQuestion> | undefined,
        onChange
    ): ReactNode {
        return <TextInput {...question} answer={answer} onChange={onChange as (newAnswer: TextAnswer) => void} />;
    },
    renderCheckboxes(
        tags: Tags,
        question: CheckboxesQuestion['props'],
        answer: Answer<CheckboxesQuestion> | undefined,
        onChange
    ): ReactNode {
        return <CheckboxesInput {...question} answer={answer} onChange={onChange as (newAnswer: CheckboxesAnswer) => void} />;
    },
    renderSelect(
        tags: Tags,
        question: SelectQuestion['props'],
        answer: Answer<SelectQuestion> | undefined,
        onChange
    ): ReactNode {
        return <SelectInput {...question} answer={answer} onChange={onChange as (newAnswer: SelectAnswer) => void} />;
    },
    renderYesNo(
        children,
        tags: Tags,
        question: YesNoQuestion['props'],
        answer: Answer<YesNoQuestion> | undefined,
        onChange
    ): ReactNode {
        return <YesNoInput {...children} {...question} answer={answer} onChange={onChange as (newAnswer: YesNoAnswer) => void} />;
    },
    renderObject(
        children,
        tags: Tags,
        question: ObjectQuestion['props'],
        answer: Answer<ObjectQuestion> | undefined
    ): ReactNode {
        return (
            <div>
                {Object.entries(children)
                    .filter(([name, child]) => !!child)
                    .map(([name, child], index) => (
                        <div key={index}>{cloneElement(child as any, { name, answer: answer ? answer[name] : undefined })}</div>
                    ))}
            </div>
        );
    },
});

const provideFormStatusRenderer: FormRendererProvider<boolean> =
    spec =>
        (tags, question, answer): boolean => {
            if (question) {
                switch (question.type) {
                    case 'Object': {
                        const children = Object.entries(question.props.fields).reduce((res, curr) => {
                            const [name, child] = curr;
                            return {
                                ...res,
                                [name]: provideFormStatusRenderer(spec)(
                                    tags,
                                    child,
                                    answer ? (answer as ObjectAnswer<ObjectQuestion>)[name] : undefined
                                ),
                            };
                        }, {});
                        return spec.renderObject(children, tags, question.props, answer as ObjectAnswer<ObjectQuestion>);
                    }
                    case 'Text':
                        return spec.renderText(tags, question['props'], answer as TextAnswer);
                    case 'YesNo':
                        const children = {
                            child:
                                question['props'].ifYes && (answer === true || (answer as YesNoAnswerWithChildren)?.value === true)
                                    ? provideFormStatusRenderer(spec)(
                                        tags,
                                        question['props'].ifYes,
                                        answer ? (answer as YesNoAnswerWithChildren).ifYes : undefined
                                    )
                                    : question['props'].ifNo && (answer === false || (answer as YesNoAnswerWithChildren)?.value === false)
                                        ? provideFormStatusRenderer(spec)(
                                            tags,
                                            question['props'].ifNo,
                                            answer ? (answer as YesNoAnswerWithChildren).ifNo : undefined
                                        )
                                        : null,
                        };
                        return spec.renderYesNo(children, tags, question['props'], answer as YesNoAnswer);
                    case 'Date':
                        return spec.renderDate(tags, question['props'], answer as DateAnswer);
                    default:
                        return false;
                }
            }
            return false;
        };

export const isCompleted = provideFormStatusRenderer({
    renderDate(tags, question: DateQuestion['props'], answer: Answer<DateQuestion> | undefined): boolean {
        return question?.optional ? true : moment(answer).isValid();
    },
    renderText(tags, question: TextQuestion['props'], answer: Answer<TextQuestion> | undefined): boolean {
        return question?.optional ? true : answer ? answer?.trim() !== '' : false;
    },
    renderCheckboxes(
        tags,
        question: CheckboxesQuestion['props'],
        answer: Answer<CheckboxesQuestion> | undefined
    ): boolean {
        return question?.optional ? true : answer ? Object.values(answer).some(e => e) : false;
    },
    renderSelect(tags, question: SelectQuestion['props'], answer: Answer<SelectQuestion> | undefined): boolean {
        return question?.optional ? true : !!answer;
    },
    renderYesNo(children, tags, question: YesNoQuestion['props'], answer: Answer<YesNoQuestion> | undefined): boolean {
        if (question?.optional) {
            return true;
        } else {
            if (isBoolean(answer)) {
                return true;
            } else {
                if (isBoolean((answer as YesNoAnswerWithChildren)?.value)) {
                    return (answer as YesNoAnswerWithChildren).value
                        ? question?.ifYes
                            ? !!children.child
                            : true
                        : question?.ifNo
                            ? !!children.child
                            : true;
                } else {
                    return false;
                }
            }
        }
    },
    renderObject(children, tags, question: ObjectQuestion['props'], answer: Answer<ObjectQuestion> | undefined): boolean {
        if (question?.optional) {
            return true;
        } else {
            const answerKeys = children ? Object.keys(children) : [];
            return Object.keys(question.fields).every(e => answerKeys.includes(e)) && Object.values(children).every(e => e);
        }
    },
});
