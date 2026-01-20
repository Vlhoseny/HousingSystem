# API Integration Documentation

## Overview
The Housing Management System frontend is now connected to the backend API. This document explains how the API integration works and how to use it in your components.

## Architecture

### 1. API Configuration (`src/lib/api.ts`)
- Base API URL: `http://housingms.runasp.net/api`
- All API functions with proper TypeScript typing
- Automatic authentication token handling
- Error handling and response normalization

### 2. TypeScript Types (`src/lib/types.ts`)
- Complete type definitions based on Swagger schema
- Interfaces for all DTOs (Data Transfer Objects)
- Request and response types

### 3. React Query Hooks (`src/hooks/useApi.ts`)
- Custom hooks for data fetching and mutations
- Automatic caching and refetching
- Loading and error states
- Optimistic updates

## Setup

### React Query Provider
The app is wrapped with `QueryClientProvider` in `src/main.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
```

## Usage Examples

### 1. Fetching Data (Query)

```tsx
import { useBuildings } from '@/hooks/useApi';

function MyComponent() {
  const { data: buildings, isLoading, error } = useBuildings();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {buildings?.map(building => (
        <div key={building.buildingId}>{building.name}</div>
      ))}
    </div>
  );
}
```

### 2. Creating Data (Mutation)

```tsx
import { useCreateBuilding } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

function CreateBuilding() {
  const createMutation = useCreateBuilding();
  const { toast } = useToast();
  
  const handleSubmit = async (formData) => {
    try {
      const response = await createMutation.mutateAsync(formData);
      
      if (response.error) {
        toast({
          title: 'Error',
          description: response.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Building created successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### 3. Updating Data

```tsx
import { useUpdateBuilding } from '@/hooks/useApi';

function EditBuilding({ buildingId }) {
  const updateMutation = useUpdateBuilding();
  
  const handleUpdate = async (formData) => {
    const response = await updateMutation.mutateAsync({
      id: buildingId,
      data: formData
    });
    
    if (response.error) {
      // Handle error
    } else {
      // Handle success
    }
  };
  
  return (
    // Form JSX
  );
}
```

### 4. Deleting Data

```tsx
import { useDeleteBuilding } from '@/hooks/useApi';

function DeleteButton({ buildingId }) {
  const deleteMutation = useDeleteBuilding();
  
  const handleDelete = async () => {
    if (!confirm('Are you sure?')) return;
    
    const response = await deleteMutation.mutateAsync(buildingId);
    
    if (response.error) {
      // Handle error
    } else {
      // Handle success
    }
  };
  
  return (
    <button onClick={handleDelete} disabled={deleteMutation.isPending}>
      {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

## Available API Hooks

### Admin Hooks

#### Applications
- `useApplications()` - Get all applications
- `useApplicationDetails(id)` - Get application details
- `useAcceptApplication()` - Accept an application
- `useRejectApplication()` - Reject an application

#### Buildings
- `useBuildings()` - Get all buildings
- `useBuilding(id)` - Get single building
- `useCreateBuilding()` - Create building
- `useUpdateBuilding()` - Update building
- `useDeleteBuilding()` - Delete building

#### Rooms
- `useRooms()` - Get all rooms
- `useRoom(id)` - Get single room
- `useCreateRoom()` - Create room
- `useUpdateRoom()` - Update room
- `useDeleteRoom()` - Delete room
- `useAssignRoom()` - Assign room to student

#### Students
- `useStudents()` - Get all students
- `useStudent(id)` - Get single student

#### Complaints
- `useComplaints()` - Get unresolved complaints
- `useResolveComplaint()` - Resolve a complaint

#### Payments
- `usePayments()` - Get pending payments
- `useApprovePayment()` - Approve payment
- `useRejectPayment()` - Reject payment

#### Housing Fees
- `useHousingFees()` - Get all housing fees

#### Notifications
- `useSendNotificationToAll()` - Send notification to all students

#### Dashboard
- `useDashboardSummary()` - Get dashboard summary data

#### Application Windows
- `useApplicationWindows()` - Get all application windows
- `useActiveApplicationWindow()` - Get active window

### Student Hooks

#### Profile
- `useStudentProfile()` - Get student profile
- `useStudentNotifications()` - Get student notifications
- `useMarkNotificationRead()` - Mark notification as read
- `useStudentFees()` - Get student fees
- `useStudentAssignments()` - Get room assignments

#### Applications
- `useStudentApplications()` - Get student's applications
- `useSubmitApplication()` - Submit new application

#### Complaints
- `useSubmitComplaint()` - Submit a complaint

## Direct API Access

If you need to call API functions directly without hooks:

```tsx
import { buildingsApi } from '@/lib/api';

async function fetchBuildings() {
  const response = await buildingsApi.getAll();
  
  if (response.error) {
    console.error(response.error);
    return;
  }
  
  console.log(response.data);
}
```

## Authentication

The API automatically includes the authentication token in all requests:

```tsx
import { setAuthToken, removeAuthToken } from '@/lib/api';

// After login
setAuthToken(token);

// On logout
removeAuthToken();
```

## Error Handling

All API responses have this structure:

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
```

Always check for errors:

```tsx
const response = await someApi.someMethod();

if (response.error) {
  // Handle error
  console.error(response.error);
} else {
  // Use response.data
  console.log(response.data);
}
```

## Cache Invalidation

React Query automatically invalidates and refetches data after mutations. Query keys are defined in `src/hooks/useApi.ts`:

```typescript
export const queryKeys = {
  applications: ['applications'],
  buildings: ['buildings'],
  rooms: ['rooms'],
  students: ['students'],
  // ... etc
};
```

## Best Practices

1. **Use Hooks**: Prefer using the custom hooks over direct API calls
2. **Handle Loading States**: Always show loading indicators
3. **Handle Errors**: Display user-friendly error messages
4. **Use TypeScript**: Leverage type safety for API calls
5. **Cache Management**: Let React Query handle caching automatically
6. **Optimistic Updates**: Consider using optimistic updates for better UX

## Example: Complete Component

See `src/pages/BuildingsExample.tsx` for a complete example of a CRUD component using the API.

## Testing API

You can test the API connection by checking the browser console for any errors and verifying that data is loaded in components like the Dashboard.

## Troubleshooting

### CORS Issues
If you encounter CORS errors, the backend needs to allow requests from your frontend domain.

### Authentication Errors
Make sure the token is properly stored and included in requests. Check localStorage for 'auth_token'.

### Network Errors
Verify the API base URL is correct and the backend server is running.

## Next Steps

1. Update remaining pages to use API hooks
2. Add error boundaries for better error handling
3. Implement retry logic for failed requests
4. Add request/response interceptors if needed
5. Consider adding React Query Devtools for debugging
