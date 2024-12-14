import React from 'react';
import { LandingPageConfig } from '../../../types';
import { TextInput } from '../shared/TextInput';
import { Button } from '../../ui/button';
import { Plus, Trash, Star } from 'lucide-react';
import TiptapEditor from '../shared/TiptapEditor';
interface Props {
  data: LandingPageConfig['testimonials'];
  onChange: (data: LandingPageConfig['testimonials']) => void;
}

export const TestimonialsEditor: React.FC<Props> = ({ data, onChange }) => {
  const addTestimonial = () => {
    const newId = (data.items.length + 1).toString();
    onChange({
      ...data,
      items: [
        ...data.items,
        {
          id: newId,
          name: 'New Testimonial',
          role: 'Role',
          company: 'Company',
          content: 'Testimonial content',
          rating: 5
        }
      ]
    });
  };

  const updateTestimonial = (id: string, field: string, value: any) => {
    const newItems = data.items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items: newItems });
  };

  const removeTestimonial = (id: string) => {
    const newItems = data.items.filter(item => item.id !== id);
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="space-y-6">
      <TiptapEditor
          content={data.title}
          onContentChange={(content) => onChange({ ...data, title: content })}
        />

<TiptapEditor
          content={data.subtitle}
          onContentChange={(content) => onChange({ ...data, subtitle: content })}
        />

      <div className="space-y-4">
        {data.items.map((testimonial) => (
          <div key={testimonial.id} className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[#D3D3DF]">Testimonial</h3>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeTestimonial(testimonial.id)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Name"
                value={testimonial.name}
                onChange={(value) => updateTestimonial(testimonial.id, 'name', value)}
              />
              <TextInput
                label="Role"
                value={testimonial.role}
                onChange={(value) => updateTestimonial(testimonial.id, 'role', value)}
              />
              <TextInput
                label="Company"
                value={testimonial.company}
                onChange={(value) => updateTestimonial(testimonial.id, 'company', value)}
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#D3D3DF]">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => updateTestimonial(testimonial.id, 'rating', rating)}
                      className={`p-1 ${rating <= testimonial.rating ? 'text-yellow-400' : 'text-gray-400'}`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <TextInput
                  label="Content"
                  value={testimonial.content}
                  onChange={(value) => updateTestimonial(testimonial.id, 'content', value)}
                  textArea
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          onClick={addTestimonial}
          className="w-full flex items-center justify-center gap-2 bg-purple-900 text-white hover:bg-purple-900/90"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Button>
      </div>
    </div>
  );
};