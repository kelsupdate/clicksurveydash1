import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  type: string;
  options: string[];
  correctAnswer: string | null;
}

interface SurveyQuestionProps {
  questions: Question[];
  surveyId: string;
  reward: number;
  title: string;
  duration: string;
  onComplete: (surveyId: string, answers: Record<string, string>) => void;
  onCancel: () => void;
}

const SurveyQuestion = ({ 
  questions, 
  surveyId, 
  reward,
  title,
  duration,
  onComplete, 
  onCancel 
}: SurveyQuestionProps) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = async () => {
    if (!selectedAnswer) {
      toast({
        title: "Answer required",
        description: "Please select an answer before continuing",
        variant: "destructive"
      });
      return;
    }

    const newAnswers = { ...answers, [currentQuestion.id]: selectedAnswer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
    } else {
      setIsSubmitting(true);
      try {
        await onComplete(surveyId, newAnswers);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[questions[currentQuestionIndex - 1].id] || "");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Reward: KSh {reward}</Badge>
              <Badge variant="outline">Duration: {duration}</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
              <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                {currentQuestion.options.map((option, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-2 mb-3 p-3 rounded-lg border transition-colors ${
                      selectedAnswer === option 
                        ? 'border-primary bg-primary/10' 
                        : 'border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer w-full">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={onCancel}
                className="bg-gray-100 hover:bg-gray-200"
              >
                Cancel Survey
              </Button>
              <div className="space-x-2">
                {currentQuestionIndex > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                  >
                    Previous
                  </Button>
                )}
              <Button
                onClick={handleNext}
                disabled={!selectedAnswer || isSubmitting}
                className="bg-gradient-primary hover:opacity-90"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {currentQuestionIndex === questions.length - 1 ? "Submitting..." : "Loading..."}
                  </>
                ) : currentQuestionIndex === questions.length - 1 ? "Complete Survey" : "Next"}
              </Button>

              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyQuestion;
