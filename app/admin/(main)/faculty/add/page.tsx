"use client"

import React, { useEffect, useState } from 'react'
import { PageWithBackButton } from '../../_components/PageWithBackButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQuery } from "@tanstack/react-query"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2, X } from 'lucide-react'
import { facultySchema } from '@/lib/validation'
import { useCreate } from './mutation'


export default function AddFacultyForm() {
    const [selectedSubjects, setSelectedSubjects] = useState<{ id: string, subjectName: string }[]>([]);
    const [currentSelectedSubject, setCurrentSelectedSubject] = useState('');

    const form = useForm({
        resolver: zodResolver(facultySchema),
        defaultValues: {
            facultyName: '',
            department: '',
            subjectIds: []
        }
    });

    const { data: subjects, isLoading } = useQuery({
        queryKey: ['subject', 'all'],
        queryFn: async (): Promise<{ id: string, subjectName: string }[]> => {
            const response = await fetch(`/api/admin/getSubject`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to get subjects')
            }
            return response.json()
        }
    });

    const handleSubjectSelection = (subjectId: string) => {
        const subject = subjects?.find(sub => sub.id === subjectId);
        if (subject) {
            setSelectedSubjects(prev => {
                const isAlreadySelected = prev.some(s => s.id === subjectId);
                if (isAlreadySelected) {
                    return prev.filter(s => s.id !== subjectId);
                } else {
                    return [...prev, subject];
                }
            });
            setCurrentSelectedSubject(subject.id);
        }
    };

    useEffect(() => {
        if (selectedSubjects) {
            form.setValue('subjectIds', selectedSubjects.map(s => s.id.toString()), {
                shouldValidate: true
            });
        }
    }, [selectedSubjects, form]);

    const { mutate, status } = useCreate()
    const handleSubmit = async (payload: z.infer<typeof facultySchema>) => {
        mutate(payload, {
            onSuccess: () => {
                form.reset({
                    facultyName: '',
                    department: '',
                })
                setSelectedSubjects([]);
                setCurrentSelectedSubject('');
            }
        })
    };


    return (
        <PageWithBackButton pageTitle='Add Faculty' backButtonHref='/admin/faculty'>
            <div className='space-y-6 max-w-2xl mx-auto'>
                <Card>
                    <CardHeader>
                        <CardTitle>Faculty Registration Form</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name='subjectIds'
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>Select Subjects</FormLabel>
                                                <FormControl>
                                                    <div>
                                                        <Select
                                                            value={currentSelectedSubject}
                                                            onValueChange={handleSubjectSelection}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select Subjects' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <ScrollArea className="h-72">
                                                                    <SelectGroup>
                                                                        {subjects?.map((subject) => (
                                                                            <SelectItem
                                                                                key={subject.id}
                                                                                value={subject.id}
                                                                            >
                                                                                <div className="flex items-center justify-between w-full">
                                                                                    <span>{subject.subjectName}</span>
                                                                                    {selectedSubjects.some(s => s.id === subject.id) && (
                                                                                        <Check className="h-4 w-4 text-green-500 ml-2" />
                                                                                    )}
                                                                                </div>
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectGroup>
                                                                </ScrollArea>
                                                            </SelectContent>
                                                        </Select>
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {selectedSubjects.map((subject) => (
                                                                <Badge
                                                                    key={subject.id}
                                                                    variant="secondary"
                                                                    className="flex items-center"
                                                                >
                                                                    {subject.subjectName}
                                                                    <X
                                                                        className="h-3 w-3 ml-1 cursor-pointer"
                                                                        onClick={() => handleSubjectSelection(subject.id)}
                                                                    />
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='grid md:grid-cols-2 gap-4'>
                                    <FormField
                                        control={form.control}
                                        name='facultyName'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder='Enter full name'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='department'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Department</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={(value) => field.onChange(value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select Department' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {['CITE'].map((dept) => (
                                                                    <SelectItem key={dept} value={dept}>
                                                                        {dept}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='flex justify-start'>
                                    <Button
                                        type='submit'
                                        className='min-w-[120px]'
                                        disabled={status === 'pending'}
                                    >
                                        {status === 'pending' ? (<Loader2 className='h-4 w-4 animate-spin' />) : 'Save'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </PageWithBackButton>
    )
}