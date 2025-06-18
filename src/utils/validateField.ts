export function validateField(name: any, value: any, rules:any) {
    const { required, minLength, maxLength, pattern, type } = rules;
  
    if (required && !value.trim()) {
      return `${name?.replaceAll("_", " ")} is required`;
    }
  
    if (minLength && value.length < minLength) {
      return `${name} must be at least ${minLength} characters`;
    }
  
    if (maxLength && value.length > maxLength) {
      return `${name} must be less than ${maxLength} characters`;
    }
  
    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Invalid email address';
      }
    }
  
    if (pattern && !pattern.test(value)) {
      return `${name?.replaceAll("_", " ")} is invalid`;
    }
  
    return ''; // No errors
  }
  