import { useState, FormEvent } from 'react';
import { LearningPlan } from '../../../types/learning-type';

interface PlanFormProps {
    initialData?: Partial<LearningPlan>;
    onSubmit: (data: Partial<LearningPlan>) => Promise<void>;
    isSubmitting: boolean;
    buttonText: string;
}

export function PlanForm({
    initialData = {},
    onSubmit,
    isSubmitting,
    buttonText
}: PlanFormProps) {
    const [formData, setFormData] = useState<Partial<LearningPlan>>({
        title: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        topics: [],
        resources: [],
        shared: false,
        ...initialData,
    });

    const [newTopic, setNewTopic] = useState('');
    const [newResourceUrl, setNewResourceUrl] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : value,
        });
    };

    const handleAddTopic = () => {
        if (newTopic.trim()) {
            setFormData({
                ...formData,
                topics: [...(formData.topics || []), newTopic.trim()],
            });
            setNewTopic('');
        }
    };

    const handleRemoveTopic = (index: number) => {
        const updatedTopics = [...(formData.topics || [])];
        updatedTopics.splice(index, 1);
        setFormData({ ...formData, topics: updatedTopics });
    };

    const handleAddResource = () => {
        if (newResourceUrl.trim()) {
            setFormData({
                ...formData,
                resources: [...(formData.resources || []), newResourceUrl.trim()],
            });
            setNewResourceUrl('');
        }
    };

    const handleRemoveResource = (index: number) => {
        const updatedResources = [...(formData.resources || [])];
        updatedResources.splice(index, 1);
        setFormData({ ...formData, resources: updatedResources });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate?.split('T')[0] || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        End Date
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate?.split('T')[0] || ''}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Topics</label>
                <div className="flex mt-1">
                    <input
                        type="text"
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        placeholder="Add a topic"
                        className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddTopic}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Add
                    </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {formData.topics?.map((topic, index) => (
                        <div key={index} className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
                            {topic}
                            <button
                                type="button"
                                onClick={() => handleRemoveTopic(index)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Resources</label>
                <div className="flex mt-1">
                    <input
                        type="url"
                        value={newResourceUrl}
                        onChange={(e) => setNewResourceUrl(e.target.value)}
                        placeholder="Resource URL"
                        className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddResource}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Add
                    </button>
                </div>
                <ul className="mt-2 space-y-2">
                    {formData.resources?.map((resource, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div>
                                <a href={resource} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {resource}
                                </a>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveResource(index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="shared"
                    name="shared"
                    checked={formData.shared || false}
                    onChange={(e) => setFormData({ ...formData, shared: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="shared" className="ml-2 block text-sm text-gray-900">
                    Share with community
                </label>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                >
                    {isSubmitting ? 'Submitting...' : buttonText}
                </button>
            </div>
        </form>
    );
}