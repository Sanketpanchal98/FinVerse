import { useState, useRef, useCallback } from "react";

const useFormFieldTracking = (initialData) => {
    const [formData, setFormData] = useState(initialData);
    const [changedFields, setChangedFields] = useState({});
    const initialDataRef = useRef(initialData);

    const updateField = useCallback((fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        
        // Track if field has changed from initial value
        const hasChanged = initialDataRef.current[fieldName] !== value;
        setChangedFields(prev => ({ 
            ...prev, 
            [fieldName]: hasChanged 
        }));
    }, []);

    const getChangedData = useCallback(() => {
        const changes = {};
        Object.keys(changedFields).forEach(key => {
            if (changedFields[key]) {
                changes[key] = formData[key];
            }
        });
        return changes;
    }, [changedFields, formData]);

    const resetTracking = useCallback((newInitialData) => {
        setFormData(newInitialData);
        setChangedFields({});
        initialDataRef.current = newInitialData;
    }, []);

    return {
        formData,
        updateField,
        getChangedData,
        resetTracking,
        hasChanges: Object.values(changedFields).some(Boolean)
    };
};

export default useFormFieldTracking