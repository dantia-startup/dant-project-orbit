import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, UserPlus, Plus, Eye, EyeOff, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

interface Organization {
  id: string;
  name: string;
  created_at: string;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  organization_id: string | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: "admin" | "user";
}

function PasswordField({ value, onChange, label, placeholder }: { value: string; onChange: (v: string) => void; label?: string; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <Label>{label || "Senha *"}</Label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          placeholder={placeholder || "Mínimo 6 caracteres"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-10 w-10"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </>
  );
}

export default function Administrador() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [orgDialogOpen, setOrgDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    full_name: "",
    organization_id: "",
    role: "user" as "admin" | "user",
  });
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);

  // Edit user state
  const [editTarget, setEditTarget] = useState<Profile | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    organization_id: "",
    role: "user" as "admin" | "user",
    password: "",
  });

  useEffect(() => {
    fetchOrganizations();
    fetchProfiles();
    fetchUserRoles();
  }, []);

  async function fetchOrganizations() {
    const { data } = await supabase.from("organizations").select("*").order("created_at", { ascending: false });
    if (data) setOrganizations(data as Organization[]);
  }

  async function fetchProfiles() {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setProfiles(data as Profile[]);
  }

  async function fetchUserRoles() {
    const { data } = await supabase.from("user_roles").select("user_id, role");
    if (data) setUserRoles(data as UserRole[]);
  }

  function getUserRole(userId: string): "admin" | "user" {
    return userRoles.find((r) => r.user_id === userId)?.role || "user";
  }

  async function handleCreateOrg() {
    if (!orgName.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("organizations").insert({ name: orgName.trim() });
    setLoading(false);
    if (error) {
      toast.error("Erro ao criar organização: " + error.message);
    } else {
      toast.success("Organização criada com sucesso!");
      setOrgName("");
      setOrgDialogOpen(false);
      fetchOrganizations();
    }
  }

  async function handleCreateUser() {
    if (!newUser.email || !newUser.password || !newUser.full_name) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("create-user", {
      body: {
        email: newUser.email,
        password: newUser.password,
        full_name: newUser.full_name,
        organization_id: newUser.organization_id || null,
        role: newUser.role,
      },
    });
    setLoading(false);
    if (error || data?.error) {
      toast.error("Erro ao criar usuário: " + (data?.error || error?.message));
    } else {
      toast.success("Usuário criado com sucesso!");
      setNewUser({ email: "", password: "", full_name: "", organization_id: "", role: "user" });
      setUserDialogOpen(false);
      fetchProfiles();
      fetchUserRoles();
    }
  }

  async function handleDeleteUser() {
    if (!deleteTarget) return;
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("delete-user", {
      body: { user_id: deleteTarget.user_id },
    });
    setLoading(false);
    setDeleteTarget(null);
    if (error || data?.error) {
      toast.error("Erro ao excluir usuário: " + (data?.error || error?.message));
    } else {
      toast.success("Usuário excluído com sucesso!");
      fetchProfiles();
      fetchUserRoles();
    }
  }

  function openEditDialog(profile: Profile) {
    setEditTarget(profile);
    setEditForm({
      full_name: profile.full_name,
      email: profile.email,
      organization_id: profile.organization_id || "",
      role: getUserRole(profile.user_id),
      password: "",
    });
    setEditDialogOpen(true);
  }

  async function handleUpdateUser() {
    if (!editTarget) return;
    if (!editForm.full_name.trim() || !editForm.email.trim()) {
      toast.error("Nome e e-mail são obrigatórios.");
      return;
    }
    if (editForm.password && editForm.password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    setLoading(true);
    const body: Record<string, unknown> = {
      user_id: editTarget.user_id,
      full_name: editForm.full_name.trim(),
      email: editForm.email.trim(),
      organization_id: editForm.organization_id || null,
      role: editForm.role,
    };
    if (editForm.password) {
      body.password = editForm.password;
    }

    const { data, error } = await supabase.functions.invoke("update-user", { body });
    setLoading(false);

    if (error || data?.error) {
      toast.error("Erro ao atualizar usuário: " + (data?.error || error?.message));
    } else {
      toast.success("Usuário atualizado com sucesso!");
      setEditDialogOpen(false);
      setEditTarget(null);
      fetchProfiles();
      fetchUserRoles();
    }
  }

  function getOrgName(orgId: string | null) {
    if (!orgId) return "—";
    return organizations.find((o) => o.id === orgId)?.name || "—";
  }

  return (
    <div className="space-y-8">
      {/* Organizations Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Organizações</h2>
          </div>
          <Dialog open={orgDialogOpen} onOpenChange={setOrgDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Nova Organização
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Organização</DialogTitle>
                <DialogDescription>Preencha o nome para criar uma nova organização.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Nome da Organização</Label>
                  <Input
                    id="org-name"
                    placeholder="Ex: Empresa XYZ"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOrgDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateOrg} disabled={loading || !orgName.trim()}>
                  {loading ? "Criando..." : "Criar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[300px]">ID</TableHead>
                <TableHead className="w-[180px]">Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    Nenhuma organização cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{org.id}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(org.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Users Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Usuários</h2>
          </div>
          <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Usuário</DialogTitle>
                <DialogDescription>Preencha os dados para criar um novo usuário na plataforma.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="user-name">Nome Completo *</Label>
                  <Input
                    id="user-name"
                    placeholder="Nome do usuário"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email *</Label>
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <PasswordField
                    value={newUser.password}
                    onChange={(v) => setNewUser({ ...newUser, password: v })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Organização</Label>
                  <Select
                    value={newUser.organization_id}
                    onValueChange={(v) => setNewUser({ ...newUser, organization_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma organização" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(v) => setNewUser({ ...newUser, role: v as "admin" | "user" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setUserDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateUser} disabled={loading}>
                  {loading ? "Criando..." : "Criar Usuário"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Organização</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[180px]">Criado em</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Nenhum usuário cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">{profile.full_name}</TableCell>
                    <TableCell className="text-muted-foreground">{profile.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getOrgName(profile.organization_id)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getUserRole(profile.user_id) === "admin" ? "default" : "outline"}>
                        {getUserRole(profile.user_id) === "admin" ? "Admin" : "Usuário"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(profile.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => openEditDialog(profile)}
                          disabled={loading}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(profile)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário <strong>{deleteTarget?.full_name}</strong> ({deleteTarget?.email})? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => { if (!open) { setEditDialogOpen(false); setEditTarget(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>Altere os dados do usuário. Deixe o campo de senha vazio para manter a senha atual.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome Completo *</Label>
              <Input
                placeholder="Nome do usuário"
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <PasswordField
                value={editForm.password}
                onChange={(v) => setEditForm({ ...editForm, password: v })}
                label="Nova Senha (opcional)"
                placeholder="Deixe vazio para não alterar"
              />
            </div>
            <div className="space-y-2">
              <Label>Organização</Label>
              <Select
                value={editForm.organization_id}
                onValueChange={(v) => setEditForm({ ...editForm, organization_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma organização" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select
                value={editForm.role}
                onValueChange={(v) => setEditForm({ ...editForm, role: v as "admin" | "user" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditDialogOpen(false); setEditTarget(null); }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateUser} disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
