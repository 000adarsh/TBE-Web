import React, { useEffect, useState } from 'react';
import {
  Button,
  QuestionLink,
  SheetHeroContainer,
  FlexContainer,
  MDXRenderer,
  ProgressBar,
  Section,
  SEO,
  Text,
} from '@/components';
import { SheetPageProps } from '@/interfaces';
import { getSheetPageProps } from '@/utils';
import { useApi, useUser } from '@/hooks';
import { routes } from '@/constant';

const SheetPage = ({
  sheet,
  meta,
  slug,
  seoMeta,
  currentQuestionId,
}: SheetPageProps) => {
  const [sheetMeta, setSheetMeta] = useState<string>(meta || '');
  const [questions, setQuestions] = useState(sheet.questions || []);
  const [isQuestionCompleted, setIsQuestionCompleted] = useState(
    questions.find((question) => question._id.toString() === currentQuestionId)
      ?.isCompleted
  );
  const [isLoading, setIsLoading] = useState(false);

  // Calculate total and completed questions for the progress bar
  const totalQuestions = questions.length;
  const completedQuestions = questions.filter(
    (question) => question.isCompleted
  ).length;

  useEffect(() => {
    const currentQuestion = questions.find(
      (question) => question._id.toString() === currentQuestionId
    );
    setIsQuestionCompleted(currentQuestion?.isCompleted);

    if (currentQuestion) {
      const updatedMeta = `${currentQuestion.question}\n\n${currentQuestion.answer}`;
      setSheetMeta(updatedMeta);
    }
  }, [currentQuestionId, questions]);

  const { makeRequest } = useApi(`interview-prep/${sheet}`);
  const { user } = useUser();

  if (!sheet) return null;

  const handleQuestionClick = (questionMeta: string) => {
    setSheetMeta(questionMeta);
  };

  const toggleCompletion = async () => {
    setIsLoading(true);
    try {
      const newCompletionStatus = !isQuestionCompleted;

      await makeRequest({
        method: 'PATCH',
        url: routes.api.markSheetQuestionAsCompleted,
        body: {
          userId: user?.id,
          sheetId: sheet._id,
          questionId: currentQuestionId,
          isCompleted: newCompletionStatus,
        },
      });

      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question._id.toString() === currentQuestionId
            ? { ...question, isCompleted: newCompletionStatus }
            : question
        )
      );

      if (newCompletionStatus) {
        const currentIndex = questions.findIndex(
          (question) => question._id.toString() === currentQuestionId
        );

        let nextIncompleteQuestion = questions
          .slice(currentIndex + 1)
          .find((question) => !question.isCompleted);

        if (!nextIncompleteQuestion) {
          nextIncompleteQuestion = questions
            .slice(0, currentIndex)
            .find((question) => !question.isCompleted);
        }

        if (nextIncompleteQuestion) {
          const questionId = nextIncompleteQuestion._id.toString();
          window.location.href = `${slug}?sheetId=${sheet._id}&questionId=${questionId}`;
        }
      }

      setIsQuestionCompleted(newCompletionStatus);
    } catch (error) {
      console.error('Error toggling question completion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <SEO seoMeta={seoMeta} />
      <Section className='md:p-2 p-2'>
        <SheetHeroContainer
          id={sheet._id ?? ''}
          name={sheet.name ?? ''}
          isEnrolled={sheet.isEnrolled}
        />
      </Section>
      <Section className='md:p-2 p-2'>
        <FlexContainer className='w-full gap-4' itemCenter={false}>
          {/* Left Sidebar (Questions) */}
          <FlexContainer
            className='border md:w-3/12 w-full px-2 gap-1 rounded self-baseline max-h-[80vh] overflow-y-auto bg-white'
            itemCenter={false}
          >
            <div className='w-full sticky top-0 bg-inherit py-2'>
              <Text level='h5' className='heading-5'>
                Questions
              </Text>

              {/* ProgressBar */}
              <ProgressBar
                totalChapters={totalQuestions}
                completedChapters={completedQuestions}
              />
            </div>

            <FlexContainer justifyCenter={false} className='gap-px flex-grow'>
              {questions?.map(
                ({ _id, title, question, answer, isCompleted, frequency }) => {
                  const questionId = _id?.toString();

                  return (
                    <QuestionLink
                      key={questionId}
                      href={`${slug}?sheetId=${sheet._id}&questionId=${questionId}`}
                      questionId={questionId}
                      title={title}
                      question={question + '\n\n' + answer}
                      isCompleted={isCompleted}
                      currentQuestionId={currentQuestionId}
                      handleQuestionClick={handleQuestionClick}
                      frequency={frequency}
                    />
                  );
                }
              )}
            </FlexContainer>
          </FlexContainer>

          {/* Main Content Area */}
          <FlexContainer
            className='border md:w-8/12 w-full p-2 rounded'
            justifyCenter={false}
            itemCenter={false}
            disabled={!sheet.isEnrolled}
          >
            <MDXRenderer
              mdxSource={sheetMeta}
              actions={[
                currentQuestionId && (
                  <Button
                    key='complete'
                    variant={
                      isQuestionCompleted
                        ? 'SUCCESS'
                        : isLoading
                        ? 'SECONDARY'
                        : 'PRIMARY'
                    }
                    text={
                      isLoading
                        ? 'Marking...'
                        : isQuestionCompleted
                        ? 'Completed'
                        : 'Mark As Completed'
                    }
                    className='w-fit mt-2'
                    onClick={toggleCompletion}
                    isLoading={isLoading}
                  />
                ),
              ]}
            />
          </FlexContainer>
        </FlexContainer>
      </Section>
    </React.Fragment>
  );
};

export const getServerSideProps = getSheetPageProps;

export default SheetPage;
