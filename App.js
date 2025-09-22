// File: App.js
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ---------- Contact List Screen ----------
function ContactListScreen({ navigation, contacts, setContacts, darkMode, setDarkMode }) {
  const [search, setSearch] = useState("");

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const ContactCard = ({ item }) => (
    <View style={[styles.card, darkMode && styles.cardDark]}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={[styles.name, darkMode && styles.nameDark]}>
          {item.name}
        </Text>
        <Text style={[styles.phone, darkMode && styles.phoneDark]}>
          {item.phone}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() =>
          navigation.navigate("ContactDetails", { contact: item, setContacts })
        }
      >
        <Text style={[styles.menuText, darkMode && styles.menuTextDark]}>⋮</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=1200&fit=crop' }}
        style={styles.backgroundImage}
        imageStyle={{ opacity: darkMode ? 0.3 : 0.2 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>📒 Contacts Infotech</Text>

        <View style={styles.topRow}>
          <TextInput
            placeholder="🔍 Search by name or phone"
            placeholderTextColor={darkMode ? "#aaa" : "#555"}
            style={[styles.searchInput, darkMode && styles.searchInputDark]}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity
            style={styles.darkToggle}
            onPress={() => setDarkMode(!darkMode)}
          >
            <Text style={styles.darkToggleText}>
              {darkMode ? "🌙" : "☀️"}
            </Text>
          </TouchableOpacity>
        </View>

        {filteredContacts.length === 0 ? (
          <Text style={[styles.noContactsText, darkMode && { color: "#ccc" }]}>
            No contacts found
          </Text>
        ) : (
          <FlatList
            data={filteredContacts}
            renderItem={ContactCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AddContact", { setContacts })}
        >
          <Text style={styles.fabText}>➕</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
}

// ---------- Add Contact Screen ----------
function AddContactScreen({ route, navigation }) {
  const { setContacts, edit, contact } = route.params || {};
  const [name, setName] = useState(contact ? contact.name : "");
  const [phone, setPhone] = useState(contact ? contact.phone : "");

  const saveContact = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Error", "Please enter both name and phone");
      return;
    }

    if (edit) {
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, name, phone } : c))
      );
    } else {
      const newContact = {
        id: Date.now().toString(),
        name,
        phone,
        avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
        favorite: false,
      };
      setContacts((prev) => [newContact, ...prev]);
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=1200&fit=crop' }}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.2 }}
      >
        <View style={styles.formPage}>
          <Text style={styles.pageTitle}>
            {edit ? "✏️ Edit Contact" : "➕ Add Contact"}
          </Text>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />
          <TouchableOpacity style={styles.saveBtn} onPress={saveContact}>
            <Text style={styles.saveBtnText}>💾 Save</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

// ---------- Contact Details Screen ----------
function ContactDetailsScreen({ route, navigation }) {
  const { contact, setContacts } = route.params;

  const callContact = () =>
    Linking.openURL(`tel:${contact.phone}`).catch(() =>
      Alert.alert("Error", "Cannot open dialer")
    );

  const videoCall = () =>
    Linking.openURL(`facetime:${contact.phone}`).catch(() =>
      Alert.alert("Error", "Cannot open video call")
    );

  const sendSMS = () =>
    Linking.openURL(`sms:${contact.phone}`).catch(() =>
      Alert.alert("Error", "Cannot open SMS")
    );

  const sendEmail = () =>
    Linking.openURL(`mailto:${contact.name}@example.com`).catch(() =>
      Alert.alert("Error", "Cannot open Email")
    );

  const toggleFavorite = () =>
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contact.id ? { ...c, favorite: !c.favorite } : c
      )
    );

  const deleteContact = () => {
    Alert.alert("Delete", "Do you want to delete this contact?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setContacts((prev) => prev.filter((c) => c.id !== contact.id)),
      },
    ]);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=1200&fit=crop' }}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.2 }}
      >
        <View style={styles.detailsCard}>
          <Image source={{ uri: contact.avatar }} style={styles.detailsAvatar} />
        <Text style={styles.detailsName}>{contact.name}</Text>
        <Text style={styles.detailsPhone}>{contact.phone}</Text>

        <TouchableOpacity style={styles.actionBtn} onPress={callContact}>
          <Text style={styles.optionText}>📞 Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={videoCall}>
          <Text style={styles.optionText}>📹 Video Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={sendSMS}>
          <Text style={styles.optionText}>💬 Send SMS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={sendEmail}>
          <Text style={styles.optionText}>📧 Send Email</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={toggleFavorite}>
          <Text style={styles.optionText}>
            {contact.favorite ? "★ Unfavorite" : "☆ Favorite"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            navigation.navigate("AddContact", {
              edit: true,
              contact,
              setContacts,
            })
          }
        >
          <Text style={styles.optionText}>✏️ Edit</Text>
        </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={deleteContact}>
            <Text style={styles.optionText}>🗑 Delete</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

// ---------- Phone Screen ----------
function PhoneScreen({ darkMode }) {
  return (
    <SafeAreaView style={[styles.safe, darkMode && { backgroundColor: "#111" }]}>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=1200&fit=crop' }}
        style={styles.backgroundImage}
        imageStyle={{ opacity: darkMode ? 0.3 : 0.2 }}
      >
        <View style={styles.scrollContent}>
          <Text style={[styles.title, darkMode && { color: "#fff" }]}>📞 Phone Dialer</Text>
        
        <View style={styles.centered}>
          <Text style={[{ marginTop: 10, color: "#666" }, darkMode && { color: "#ccc" }]}>This will open device dialer.</Text>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => Linking.openURL("tel:")}
          >
            <Text style={styles.optionText}>Open Dialer</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

// ---------- Favorites Screen ----------
function FavoritesScreen({ contacts, navigation, setContacts, darkMode }) {
  const favs = contacts.filter((c) => c.favorite);

  return (
    <SafeAreaView style={[styles.safe, darkMode && { backgroundColor: "#111" }]}>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=1200&fit=crop' }}
        style={styles.backgroundImage}
        imageStyle={{ opacity: darkMode ? 0.3 : 0.2 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, darkMode && { color: "#fff" }]}>⭐ Favorites</Text>
        
        {favs.length === 0 ? (
          <Text style={[styles.noContactsText, darkMode && { color: "#ccc" }]}>No favorite contacts</Text>
        ) : (
          favs.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, darkMode && styles.cardDark]}
              onPress={() =>
                navigation.navigate("ContactDetails", { contact: item, setContacts })
              }
            >
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={[styles.name, darkMode && styles.nameDark]}>{item.name}</Text>
                <Text style={[styles.phone, darkMode && styles.phoneDark]}>{item.phone}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

// ---------- Tabs with Stack ----------
function Tabs({ contacts, setContacts, darkMode, setDarkMode }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Phone") iconName = "call";
          else if (route.name === "Contacts") iconName = "people";
          else if (route.name === "Favorites") iconName = "star";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Phone">
        {(props) => (
          <PhoneScreen {...props} darkMode={darkMode} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Contacts">
        {(props) => (
          <ContactListScreen {...props} contacts={contacts} setContacts={setContacts} darkMode={darkMode} setDarkMode={setDarkMode} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Favorites">
        {(props) => (
          <FavoritesScreen {...props} contacts={contacts} setContacts={setContacts} darkMode={darkMode} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// ---------- App Root ----------
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [contacts, setContacts] = useState([
    {
      id: "1",
      name: "Mohamed Irfan",
      phone: "+91 9123564141",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      favorite: false,
    },
     {
      id: "3",
      name: "Sajith Ahamed",
      phone: "+91 7871684082",
      avatar: "https://randomuser.me/api/portraits/men/65.jpg",
      favorite: false,
    },
     
    {
      id: "2",
      name: "Mohamed Rafeek",
      phone: "+91 7305792442",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      favorite: true,
    },
    
    {
      id: "8",
      name: "AL harees",
      phone: "+91 8124340249",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      favorite: true,
    },
    {
      id: "7",
      name: "murugan",
      phone: "+91 8148394143",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      favorite: false,
    },
        {
      id: "9",
      name: "Sudhakar",
      phone: "+91 9159213595",
      avatar: "https://randomuser.me/api/portraits/men/33.jpg",
      favorite: false,
    },
     {
      id: "10",
      name: " Hameed Sufiyan",
      phone: "+91 8122730705",
      avatar: "https://randomuser.me/api/portraits/men/28.jpg",
      favorite: true,
    },
    {
      id: "3",
      name: "Sajina Jahan",
      phone: "+91 8825594989",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      favorite: false,
    },
    {
      id: "4",
      name: "Fathima",
      phone: "+91 6374435384",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      favorite: false,
    },
    {
      id: "5",
      name: "Fathima Sharin",
      phone: "+91 9176010130",
      avatar: "https://randomuser.me/api/portraits/women/82.jpg",
      favorite: true,
    },
  ]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props) => <Tabs {...props} contacts={contacts} setContacts={setContacts} darkMode={darkMode} setDarkMode={setDarkMode} />}
        </Stack.Screen>
        <Stack.Screen name="AddContact" component={AddContactScreen} />
        <Stack.Screen name="ContactDetails" component={ContactDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 16, paddingBottom: 80 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: "#007AFF",
    marginBottom: 12,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  searchInputDark: { backgroundColor: "#333", color: "#fff" },
  darkToggle: { padding: 8, borderRadius: 8, backgroundColor: "#eee" },
  darkToggleText: { fontSize: 22 },

  noContactsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
    fontWeight: "600",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    elevation: 3,
  },
  cardDark: { backgroundColor: "#222" },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: "700", color: "#111" },
  nameDark: { color: "#fff" },
  phone: { color: "#555", marginBottom: 8 },
  phoneDark: { color: "#ccc" },

  menuButton: { padding: 8 },
  menuText: { fontSize: 22, color: "#333" },
  menuTextDark: { color: "#fff" },

  formPage: { flex: 1, justifyContent: "center", padding: 20 },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabText: { color: "#fff", fontSize: 28 },

  detailsCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  detailsAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  detailsName: { fontSize: 22, fontWeight: "800", marginBottom: 6 },
  detailsPhone: { fontSize: 18, color: "#666", marginBottom: 20 },
  actionBtn: {
    width: "80%",
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: "center",
    backgroundColor: "#007AFF",
  },
  optionText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  backgroundImage: { flex: 1 },
});
