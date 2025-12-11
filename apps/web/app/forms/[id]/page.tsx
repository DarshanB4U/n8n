"use client";

import api from "@/lib/api";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

type FieldType = "text" | "number" | "email" | "file" | "textarea";
interface FormField {
  id: string;
  title: string;
  type: FieldType;
}

type FieldValue = string | File | null;
type FormState = Record<string, FieldValue>;

export default function FormRenderer() {
  const params = useParams<{ id: string }>();
  const [fields, setFields] = useState<FormField[]>([]);
  const [formState, setFormState] = useState<FormState>({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const getForm = useCallback(async () => {
    try {
      const res = await api.get(`/form/${params.id}`);
      setFields(res.data.formFields ?? []);
    } catch (err) {
      console.error("Failed to fetch form:", err);
    }
  }, [params.id]);

  useEffect(() => {
    getForm();
  }, [getForm]);

  // fallback fields if API returns nothing
  const fallbackFields: FormField[] = [
    { id: "name", title: "Name", type: "text" },
    { id: "mobile", title: "Mobile No", type: "number" },
    { id: "email", title: "Email", type: "email" },
    { id: "attachment", title: "Attachment", type: "file" },
  ];

  const formFields = fields.length > 0 ? fields : fallbackFields;

  // create keys inside formState when fields load
  useEffect(() => {
    setFormState((prev) => {
      const next = { ...prev };
      for (const f of formFields) {
        if (!(f.id in next)) next[f.id] = "";
      }
      return next;
    });
  }, [formFields]);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const name = e.target.name;
    const isFile = (e.target as HTMLInputElement).type === "file";

    if (isFile) return;

    setFormState((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const file = e.target.files?.[0] ?? null;

    setFormState((prev) => ({
      ...prev,
      [name]: file,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const fd = new FormData();
      for (const f of formFields) {
        const val = formState[f.id];
        if (val instanceof File) fd.append(f.id, val, val.name);
        else if (val) fd.append(f.id, val);
      }

      const res = await api.post(`/form/${params.id}`, fd);

      if (res.status >= 200 && res.status < 300) {
        setStatusMessage("Submitted successfully!");
        // reset form
        const resetValues: FormState = {};
        formFields.forEach((f) => (resetValues[f.id] = ""));
        setFormState(resetValues);
      } else {
        setStatusMessage("Submit failed");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Network error");
    }

    setSubmitting(false);
  }

  return (
    <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-6 sm:p-8">
      <header className="mb-4">
        <h2 className="text-2xl font-semibold"></h2>
        <p className="mt-1 text-sm text-gray-600">
          Fill the details and submit.
        </p>
      </header>

      <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
        <div className="grid gap-4">
          {formFields.map((f) => {
            const value = formState[f.id] ?? "";

            // textarea
            if (f.type === "textarea") {
              return (
                <label key={f.id} className="block">
                  <span className="text-sm font-medium text-gray-700">
                    {f.title}
                  </span>
                  <textarea
                    name={f.id}
                    value={typeof value === "string" ? value : ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full text-black rounded-lg border px-3 py-2 shadow-sm"
                  />
                </label>
              );
            }

            // file input
            if (f.type === "file") {
              return (
                <label key={f.id} className="block">
                  <span className="text-sm font-medium text-gray-700">
                    {f.title}
                  </span>
                  <input
                    name={f.id}
                    type="file"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-black rounded-lg border px-3 py-2 shadow-sm"
                  />
                </label>
              );
            }

            // normal input
            return (
              <label key={f.id} className="block">
                <span className="text-sm font-medium text-gray-700">
                  {f.title}
                </span>
                <input
                  name={f.id}
                  type={f.type}
                  value={typeof value === "string" ? value : ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full text-black rounded-lg border px-3 py-2 shadow-sm"
                />
              </label>
            );
          })}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full rounded-xl px-4 py-2 text-white font-medium ${
              submitting
                ? "bg-indigo-300 cursor-wait"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {submitting ? "Sending…" : "Submit"}
          </button>

          {statusMessage && (
            <div className="rounded-md bg-gray-50 px-4 py-2 text-sm text-gray-800">
              {statusMessage}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
