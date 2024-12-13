'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { evaluationSchema, evaluationValues } from '@/lib/validation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { CheckCircle2, CheckCircleIcon, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { useSubmitEvaluation } from '../mutation'
import { EvaluationFormSkeleton } from './EvaluationFormSkeleton'

type Question = {
    id: number;
    questionName: string;
    categoryId: number;
    category: {
        id: number;
        categoryName: string;
    };
};

type RatingScale = {
    rating: number;
    description: string;
};

export default function FormEvaluation() {
    const { toast } = useToast()
    const form = useForm({
        resolver: zodResolver(evaluationSchema),
        defaultValues: {
            facultyId: "",
            subject: "",
            subjectId: "",
            classSchedule: "",
            comments: "",
            response: {}
        }
    })

    const [responses, setResponses] = useState<Record<number, number>>({});
    const [selectedFacultyId, setSelectedFacultyId] = useState('');
    const [isSubmissionConfirmed, setIsSubmissionConfirmed] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [formKey, setFormKey] = useState(0);

    const { data, isLoading } = useQuery({
        queryKey: ['evaluation', 'question'],
        queryFn: async (): Promise<{ question: Question[], ratingScale: RatingScale[] }> => {
            const response = await fetch(`/api/evaluation`)
            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error || "Failed to fetch evaluation form")
            }
            return response.json()
        }
    })

    const { data: selectedSubjectStudent, isLoading: selectedSubjectStudentLoading } = useQuery({
        queryKey: ['subject', 'evaluation'],
        queryFn: async (): Promise<{ subjects: { id: string, subjectName: string }[] }> => {
            const response = await fetch(`/api/student/selectedSubject`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Failed to fetch selected subject")
            }
            return response.json()
        },
    })

    const { data: facultyBySubject, isLoading: facultyBySubjectLoading } = useQuery({
        queryKey: ['faculty', 'subject', selectedSubjectId],
        queryFn: async (): Promise<{ faculty: { id: string, fullName: string }[] }> => {
            const response = await fetch(`/api/student/facultyBySubject?subjectId=${selectedSubjectId}`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Failed to fetch selected subject")
            }
            return response.json()
        },
        enabled: !!selectedFacultyId
    })

    const groupQuestion = data?.question.reduce((acc, question) => {
        const categoryName = question.category.categoryName;
        if (!acc[categoryName]) {
            acc[categoryName] = []
        }

        acc[categoryName].push({
            ...question,
            ratingScale: data.ratingScale
        })

        return acc;
    }, {} as { [categoryName: string]: (Question & { ratingScale: RatingScale[] })[] })

    useEffect(() => {
        if (responses) {
            form.setValue('response', responses)
        }
    }, [form, responses])

    const handleSubmit = (payload: evaluationValues) => {

        const allQuestions = Object.values(groupQuestion || {}).flat();
        const missingResponses = allQuestions.filter(q => !payload.response[q.id]);

        if (missingResponses.length > 0) {
            toast({ description: `Please answer all questions. ${missingResponses.length} question(s) are missing a response.` });
            return;
        }

        setIsSubmissionConfirmed(true);
    }

    const { mutate: submitEval, status: submitEvalLoading } = useSubmitEvaluation()

    const confirmSubmission = () => {
        const payload = form.getValues()
        console.log(payload)
        submitEval(payload, {
            onSuccess: () => {
                setFormKey((prevKey) => prevKey + 1);

                form.reset({
                    facultyId: "",
                    subject: "",
                    classSchedule: "",
                    comments: "",
                    response: {}
                })

                setResponses({})
                setSelectedFacultyId('')
                setSelectedSubjectId('')
                setIsSubmissionConfirmed(false)

            }
        })
    }

    if (isLoading) {
        return <EvaluationFormSkeleton />
    }

    if (selectedSubjectStudent?.subjects?.length === 0) {
        return (<Card className="max-w-md mx-auto mt-8 text-center shadow-md border">
            <CardHeader>
                <div className="flex justify-center">
                    <CheckCircleIcon className="h-12 w-12 text-green-500" />
                </div>
                <CardTitle className="text-xl font-semibold mt-4">
                    You are Done Evaluating!
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600">
                    Congratulations on completing the evaluations. Take a break and get ready for the next semester!
                </p>
            </CardContent>
        </Card>)
    }

    return (
        <div className='space-y-6 gap-4 p-4' key={formKey}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Evaluation Form</CardTitle>
                            <CardDescription>Evaluate your faculty and subject taught</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='gap-4 space-y-4'>
                                <FormField
                                    control={form.control}
                                    name='subject'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Subject</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value)
                                                        setSelectedFacultyId(value)
                                                        const selectedSubject = selectedSubjectStudent?.subjects.find(
                                                            (sub) => sub.subjectName === value
                                                        )
                                                        setSelectedSubjectId(selectedSubject?.id || "")
                                                        form.setValue('subjectId', selectedSubject?.id || "")
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Subject" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {
                                                                selectedSubjectStudentLoading ? (
                                                                    <>
                                                                        <div className="flex justify-center items-center h-full">
                                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                                        </div>
                                                                    </>
                                                                ) :
                                                                    selectedSubjectStudent?.subjects?.map((ss) => (
                                                                        <SelectItem key={ss?.id} value={ss?.subjectName}>{ss?.subjectName}</SelectItem>
                                                                    ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='facultyId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Faculty</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(value) => field.onChange(value)}
                                                    disabled={!form.watch('subject')}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Faculty">
                                                            {facultyBySubject?.faculty.find((f) => f?.id?.toString() === field.value)?.fullName || 'Select Faculty'}
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {facultyBySubjectLoading ?
                                                                (
                                                                    <>
                                                                        <div className="flex justify-center items-center h-full p-4">
                                                                            <Loader2 className="h-7 w-7 animate-spin" />
                                                                        </div>
                                                                    </>
                                                                ) :
                                                                facultyBySubject?.faculty?.length === 0 ?
                                                                    (
                                                                        <div className='p-2'>
                                                                            <p className='font-semibold'>No faculty is found.</p>
                                                                        </div>
                                                                    ) :
                                                                    facultyBySubject?.faculty.map((fbs) => (
                                                                        <SelectItem
                                                                            key={fbs?.id}
                                                                            value={fbs?.id}
                                                                        >
                                                                            {fbs?.fullName}
                                                                        </SelectItem>
                                                                    ))
                                                            }
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='classSchedule'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Class Schedule</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(value) => field.onChange(value)}
                                                    disabled={!form.watch('subject') || !form.watch('facultyId')}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Class Schedule" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {['MTh', 'TF', 'WED', 'SAT'].map((cs, i) => (
                                                                <SelectItem key={i} value={cs}>{cs}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>


                    {Object.entries(groupQuestion || {}).map(([categoryName, questions], index) => (
                        <div key={categoryName} className='space-y-6 gap-4 my-4'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{String.fromCharCode(65 + index)}. {categoryName}</CardTitle>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardContent>
                                    <div className='space-y-4 mx-auto mt-2 p-4'>
                                        {questions.map((q, questionIndex) => (
                                            <div key={q.id} className='space-y-2 p-2'>
                                                <p className='font-semibold text-lg'>{questionIndex + 1}. {q.questionName}</p>
                                                <FormField
                                                    control={form.control}
                                                    name={`response`}
                                                    render={() => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <RadioGroup
                                                                    value={responses[q.id]?.toString()}
                                                                    onValueChange={(value) =>
                                                                        setResponses((prev) => ({
                                                                            ...prev,
                                                                            [q.id]: parseInt(value),
                                                                        }))
                                                                    }
                                                                    className="flex flex-wrap gap-4 justify-between"
                                                                >
                                                                    {q.ratingScale.map((scale) => (
                                                                        <div key={scale.rating} className="flex items-center space-x-1">
                                                                            <RadioGroupItem
                                                                                value={scale.rating.toString()}
                                                                                id={`${q.id}-${scale.rating}`}
                                                                            />
                                                                            <Label htmlFor={`${q.id}-${scale.rating}`}>
                                                                                {scale.description}
                                                                            </Label>
                                                                        </div>
                                                                    ))}
                                                                </RadioGroup>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        ))}

                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}


                    <Card className='mt-4'>
                        <CardHeader>
                            <CardTitle>Additional Comments</CardTitle>
                            <CardDescription>
                                Please provide any additional feedback or suggestions (Optional)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="comments"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Share your thoughts about the course, instructor, or any additional feedback..."
                                                className="resize-y"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <AlertDialog open={isSubmissionConfirmed} onOpenChange={setIsSubmissionConfirmed}>
                        <div className='mt-6 flex items-center space-x-4'>
                            <Button
                                type='submit'
                                disabled={!form.formState.isValid}
                            >
                                Review and Submit
                            </Button>
                        </div>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                    Review Your Evaluation
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Please carefully review your responses before final submission:

                                    <div className="mt-4 space-y-2 text-left">
                                        <p>
                                            <strong>Subject:</strong>{" "}
                                            {form.getValues('subject')}
                                        </p>
                                        <p>
                                            <strong>Faculty:</strong>{" "}
                                            {
                                                facultyBySubject?.faculty.find(
                                                    (f) => f.id.toString() === form.getValues('facultyId')
                                                )?.fullName || "No faculty found"
                                            }
                                        </p>
                                        <p><strong>Class Schedule:</strong> {form.getValues('classSchedule')}</p>
                                    </div>

                                    <div className="mt-4">
                                        <p className="font-semibold">Are you sure you want to submit this evaluation?</p>
                                        <p className="text-sm text-muted-foreground">
                                            Once submitted, you cannot modify your responses.
                                        </p>
                                    </div>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setIsSubmissionConfirmed(false)}>
                                    Cancel
                                </AlertDialogCancel>
                                <Button
                                    type='button'
                                    disabled={submitEvalLoading === 'pending'}
                                    onClick={confirmSubmission}
                                >
                                    {submitEvalLoading === 'pending'
                                        ? (<Loader2 className='h-5 w-5 animate-spin' />)
                                        : 'Confirm Submission'
                                    }
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </form>
            </Form>
        </div >
    )
}