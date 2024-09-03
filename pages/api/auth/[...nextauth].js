import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../../../lib/db"; // Assuming you have a MongoDB connection helper
import User from "../../../models/users"; // Assuming you have a Mongoose User model
import bcrypt from "bcrypt";
import nextAuth from "next-auth";
export const authOptions = {
	// Configure one or more authentication providers
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "your-email@example.com"
				},
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				if (!credentials.email || !credentials.password) {
					throw new Error("email and password is required");
				}
				// Connect to the database
				await connectDB();
				// Find the user by email
				const user = await User.findOne({ email: credentials.email });
				if (!user) {
					throw new Error("No user found with the email.");
				}
				// Compare the provided password with the stored hash
				const isValidPassword = await bcrypt.compare(
					credentials.password,
					user.password
				);
				if (!isValidPassword) {
					throw new Error("Invalid email or password.");
				}
				// If login is successful, return the user object
				return {
					id: user._id,
					contact: user.contact,
					name: user.username,
					email: user.email
				};
			}
		})
		// ...add more providers here (e.g., Google, Facebook, etc.)
	],
	pages: {
		signIn: "/signin" // Custom sign-in page
	},
	session: {
		strategy: "jwt" // Use JWT for session tokens
	},
	callbacks: {
		async jwt({ token, user }) {
			console.log(token, user, "token, user");
			// Attach user information to the token
			if (user) {
				token.id = user.id;
				token.email = user.email;
			}
			return token;
		},
		async session({ session, token }) {
			// Attach token information to the session
			if (token) {
				session.user.id = token.id;
				session.user.email = token.email;
			}
			return session;
		}
	},
	secret: process.env.NEXTAUTH_SECRET // Ensure to set this in your environment variables
	// Additional options...
};
export default nextAuth(authOptions);
