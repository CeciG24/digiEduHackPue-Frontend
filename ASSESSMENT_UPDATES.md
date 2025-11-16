# Assessment Component Updates

## Summary

The Assessment component has been updated to fetch test questions dynamically from the backend API instead of using hardcoded data.

## Changes Made

### 1. **Added Backend Integration**

- Added `useEffect` hook to fetch questions from the backend endpoint
- Integrated with the Flask backend route: `POST /generate-test/<lesson_id>`
- Queries get passed via `lessonId` URL parameter or defaults to `'1'`

### 2. **Enhanced State Management**

- Added `loading` state to show loading spinner while fetching
- Added `error` state to display error messages if the request fails
- Dynamically populate questions from backend response

### 3. **Response Parsing**

- The component expects a response in the format provided by your backend
- Automatically parses the `generated_text` field if it's a JSON string
- Transforms backend questions to the component's internal format

### 4. **UI Improvements**

- Added **Loading State**: Shows a spinning loader while fetching questions
- Added **Error State**: Displays error messages with a retry button
- Added **No Questions State**: Handles edge case when no questions are available

### 5. **Environment Configuration**

- Added `.env.local` for local development configuration
- Added `.env.example` as a reference for required environment variables
- Default API URL: `http://localhost:5000/api`
- Can be overridden via `VITE_API_URL` environment variable

## Usage

### URL Parameters

Pass the lesson ID as a query parameter when navigating to the assessment:

```
/assessment?lessonId=5
```

If no `lessonId` is provided, it defaults to `'1'`.

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

Or for production:

```env
VITE_API_URL=https://your-api-domain.com/api
```

### Backend Endpoint

The component makes a `POST` request to:

```
POST {API_URL}/generate-test/{lesson_id}
```

Expected response format:

```json
{
  "success": true,
  "generated_text": "{\"questions\":[{\"question\":\"...\",\"options\":[\"a\",\"b\",\"c\",\"d\"],\"answer\":2}]}"
}
```

## Error Handling

- Network errors are caught and displayed to the user
- Missing or invalid responses trigger an error state
- A "Retry" button allows users to refetch the questions

## Future Improvements

- Add pagination for large question sets
- Implement answer submission to backend for scoring
- Add analytics tracking for assessment performance
- Cache generated assessments to reduce API calls
