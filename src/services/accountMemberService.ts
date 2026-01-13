import { customInstance } from '@igorguariroba/bfin-sdk';
import type { AccountMember } from '../types/transaction';

interface ListMembersResponse {
  original_owner_id: string;
  members: AccountMember[];
}

interface CreateInvitationDTO {
  email: string;
  role: 'owner' | 'member' | 'viewer';
}

interface UpdateMemberRoleDTO {
  role: 'owner' | 'member' | 'viewer';
}

interface Invitation {
  id: string;
  account_id: string;
  invited_email: string;
  invited_by: string;
  role: string;
  status: string;
  token: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  account?: {
    id: string;
    account_name: string;
  };
  inviter: {
    id: string;
    email: string;
    full_name: string;
  };
}

export const accountMemberService = {
  // Lista membros de uma conta
  async listMembers(accountId: string): Promise<ListMembersResponse> {
    return customInstance<ListMembersResponse>({
      url: `/api/v1/accounts/${accountId}/members`,
      method: 'GET',
    });
  },

  // Cria um convite para adicionar membro à conta
  async createInvitation(accountId: string, data: CreateInvitationDTO): Promise<Invitation> {
    return customInstance<Invitation>({
      url: `/api/v1/accounts/${accountId}/invitations`,
      method: 'POST',
      data,
    });
  },

  // Lista convites de uma conta
  async listInvitations(accountId: string): Promise<Invitation[]> {
    return customInstance<Invitation[]>({
      url: `/api/v1/accounts/${accountId}/invitations`,
      method: 'GET',
    });
  },

  // Lista convites recebidos pelo usuário logado
  async listMyInvitations(): Promise<Invitation[]> {
    return customInstance<Invitation[]>({
      url: '/api/v1/invitations/my-invitations',
      method: 'GET',
    });
  },

  // Aceita um convite
  async acceptInvitation(token: string): Promise<AccountMember> {
    return customInstance<AccountMember>({
      url: `/invitations/${token}/accept`,
      method: 'POST',
    });
  },

  // Rejeita um convite
  async rejectInvitation(token: string): Promise<{ message: string }> {
    return customInstance<{ message: string }>({
      url: `/invitations/${token}/reject`,
      method: 'POST',
    });
  },

  // Atualiza o role de um membro
  async updateMemberRole(accountId: string, userId: string, data: UpdateMemberRoleDTO): Promise<AccountMember> {
    return customInstance<AccountMember>({
      url: `/api/v1/accounts/${accountId}/members/${userId}`,
      method: 'PUT',
      data,
    });
  },

  // Remove um membro da conta
  async removeMember(accountId: string, userId: string): Promise<void> {
    return customInstance<void>({
      url: `/api/v1/accounts/${accountId}/members/${userId}`,
      method: 'DELETE',
    });
  },
};
