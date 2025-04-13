
import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  MapPin, 
  Camera, 
  Edit2, 
  UserPlus, 
  Check, 
  X, 
  Search, 
  UserCheck, 
  Heart
} from "lucide-react";
import { FriendRequest } from "@/types";

const UserProfile = () => {
  const { user, updateProfile, isLoading, friends, friendRequests, acceptFriendRequest, declineFriendRequest, sendFriendRequest } = useAuth();
  const navigate = useNavigate();
  
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [city, setCity] = useState(user?.city || "");
  const [imagePreview, setImagePreview] = useState<string | null>(user?.photoUrl || null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!user) {
    navigate("/login");
    return null;
  }
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload this to storage
      // For now, create a local preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!nickname || !city) {
      setError("Please fill in all required fields");
      return;
    }
    
    try {
      await updateProfile(nickname, city, imagePreview || undefined);
      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred while updating your profile");
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Filter mock users for search (in a real app, this would be an API call)
  const filteredUsers = searchQuery ? 
    [{
      id: "search1",
      nickname: "BoardPlayer",
      city: "Denver",
      photoUrl: "https://source.unsplash.com/random/150x150/?person,6"
    },
    {
      id: "search2",
      nickname: "GameNight",
      city: "Austin",
      photoUrl: "https://source.unsplash.com/random/150x150/?person,7"
    }].filter(u => 
      u.nickname.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.city.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-foreground">Your Profile</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Section */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-primary">
                    {imagePreview ? (
                      <AvatarImage src={imagePreview} alt={user.nickname} />
                    ) : (
                      <AvatarFallback className="text-2xl bg-board-purple text-white">
                        {getInitials(user.nickname)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  {isEditing && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 bg-board-purple hover:bg-board-purple-dark text-white rounded-full p-2 shadow-md"
                    >
                      <Camera className="h-4 w-4" />
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </button>
                  )}
                </div>
                
                <div className="flex-1">
                  <CardTitle className="text-2xl">{user.nickname}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4 text-board-purple" />
                    {user.city}
                  </CardDescription>
                  <div className="mt-2">
                    <Badge variant="outline" className="bg-board-green/30 text-foreground border-board-green">
                      {friends.length} Friends
                    </Badge>
                  </div>
                </div>
                
                {!isEditing ? (
                  <Button onClick={handleEditClick} className="ml-auto" variant="outline">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : null}
              </CardHeader>
              
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                    
                    {success && (
                      <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-green-600 dark:text-green-400 rounded-lg text-sm">
                        {success}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <label htmlFor="nickname" className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-board-purple" />
                        Nickname
                      </label>
                      <Input
                        id="nickname"
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="rounded-lg"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="city" className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-board-purple" />
                        City
                      </label>
                      <Input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="rounded-lg"
                        required
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="bg-board-purple hover:bg-board-purple-dark rounded-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "Save Changes"}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setNickname(user.nickname);
                          setCity(user.city);
                          setImagePreview(user.photoUrl || null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">About</h3>
                      <p className="text-muted-foreground">
                        Board game enthusiast who loves strategy games and party games alike. 
                        Always looking for new players to join game nights!
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Account Information</h3>
                      <dl className="space-y-2">
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Email</dt>
                          <dd>{user.email}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Member since</dt>
                          <dd>April 2023</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Favorite Game Types</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-board-purple/20 text-board-purple border-board-purple/30 hover:bg-board-purple/30">
                          Strategy
                        </Badge>
                        <Badge className="bg-board-orange/20 text-board-orange-dark border-board-orange/30 hover:bg-board-orange/30">
                          Party Games
                        </Badge>
                        <Badge className="bg-board-green/20 text-board-slate border-board-green/30 hover:bg-board-green/30">
                          Card Games
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30">
                          Cooperative
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Friends Section */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Friends</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-board-purple hover:bg-board-purple-dark">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add Friend
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Find Friends</DialogTitle>
                        <DialogDescription>
                          Search for other board game enthusiasts to connect with.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="mt-4 space-y-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search by name or city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        
                        {searchQuery.length > 1 && (
                          <div className="space-y-2 mt-4">
                            {filteredUsers.length > 0 ? (
                              filteredUsers.map(user => (
                                <div key={user.id} className="flex items-center justify-between border rounded-lg p-3">
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarImage src={user.photoUrl} alt={user.nickname} />
                                      <AvatarFallback>{getInitials(user.nickname)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{user.nickname}</p>
                                      <p className="text-xs text-muted-foreground">{user.city}</p>
                                    </div>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    onClick={() => sendFriendRequest(user.id)}
                                    className="bg-board-purple hover:bg-board-purple-dark"
                                  >
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    Add
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <p className="text-center text-muted-foreground py-4">
                                No users found matching "{searchQuery}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="friends">
                  <TabsList className="w-full grid grid-cols-2 mb-4">
                    <TabsTrigger value="friends" className="rounded-l-lg">Friends</TabsTrigger>
                    <TabsTrigger value="requests" className="rounded-r-lg">
                      Requests
                      {friendRequests.length > 0 && (
                        <Badge className="ml-2 bg-board-purple hover:bg-board-purple-dark">
                          {friendRequests.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="friends" className="space-y-4">
                    {friends.length > 0 ? (
                      <div className="space-y-3">
                        {friends.map(friend => (
                          <div key={friend.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={friend.photoUrl} alt={friend.nickname} />
                                <AvatarFallback className="bg-board-purple text-white">
                                  {getInitials(friend.nickname)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{friend.nickname}</p>
                                <p className="text-xs text-muted-foreground">{friend.city}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/30">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Friend
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <UserCheck className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-3" />
                        <p className="text-muted-foreground">
                          No friends yet. Add some friends to connect with board game enthusiasts!
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="requests" className="space-y-4">
                    {friendRequests.length > 0 ? (
                      <div className="space-y-3">
                        {friendRequests.map((request: FriendRequest) => (
                          <div key={request.id} className="flex items-center justify-between border rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={request.sender.photoUrl} alt={request.sender.nickname} />
                                <AvatarFallback className="bg-board-purple text-white">
                                  {getInitials(request.sender.nickname)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{request.sender.nickname}</p>
                                <p className="text-xs text-muted-foreground">{request.sender.city}</p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 rounded-full bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-900/50"
                                onClick={() => acceptFriendRequest(request.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 rounded-full bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                onClick={() => declineFriendRequest(request.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Heart className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-3" />
                        <p className="text-muted-foreground">
                          No pending friend requests.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
