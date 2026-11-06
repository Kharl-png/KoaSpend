import type { OwnerRequestsData, RequestStatus } from '../../types/requests'

export function filterRequests(
  data: OwnerRequestsData,
  status: 'all' | RequestStatus,
  projectId: string,
  searchQuery: string,
) {
  const query = searchQuery.trim().toLowerCase()

  return data.requests.filter((request) => {
    const project = data.projects.find((item) => item.id === request.projectId)
    const matchesQuery = [
      request.title,
      request.memberName,
      project?.name ?? '',
    ].some((value) => value.toLowerCase().includes(query))

    return (
      (status === 'all' || request.status === status) &&
      (projectId === 'all' || request.projectId === projectId) &&
      matchesQuery
    )
  })
}
