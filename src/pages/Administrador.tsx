import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, UserPlus, Plus } from "lucide-react";
import { toast } from "sonner";

interface Organization {
  id: string;
  name: string;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string;
  email: string;
  organization_id: string | null;
  created_at: string;
}

export default function Administrador() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
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

  useEffect(() => {
    fetchOrganizations();
    fetchProfiles();
  }, []);

  async function fetchOrganizations() {
    const { data } = await supabase.from("organizations").select("*").order("created_at", { ascending: false });
    if (data) setOrganizations(data as Organization[]);
  }

  async function fetchProfiles() {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setProfiles(data as Profile[]);
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
                  <Label htmlFor="user-password">Senha *</Label>
                  <Input
                    id="user-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
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
                <TableHead className="w-[180px]">Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
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
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(profile.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
