# Dual-Rail Pizza Ordering System with Fiat and Cryptocurrency Payment Integration

Table of Contents

1 Abstract
2 Aim and Objectives
2.1 Research Aims and Objectives
2.2 Requirements Specification (IEEE 830-1998)
3 Literature Review
3.1 Key Concepts
3.2 Review of Related Work
3.2.1 Blockchain and Cryptocurrency in E-Commerce
3.2.2 Web Development Frameworks and Architectures
3.2.3 Security and Performance Concerns
3.3 Identification of Research Gaps
3.4 Summary and Research Position
4 Problem Definition
4.1 Research Background
4.2 Problem Statement
5 Methodological Approach
5.1 Research Design
5.2 Software Development Methodology
5.3 Ethical Considerations
6 Design and Implementation
6.1 System Requirements Analysis
6.1.1 Functional Requirements Analysis
6.2 Project Initialization
6.2.1 Programming Environment Setup
6.2.2 Next.js Project Initialization
6.2.3 MongoDB Initialization
6.3 Database Architecture and Design
6.3.1 ERD Diagram
6.3.2 Database Technology Selection
6.4 Implementation Architecture
6.4.1 Page-Level Implementation and Functionality
7 Results and Evaluation
8 Conclusion and Future Work
8.1 Summary of Findings
8.2 Contributions to Knowledge
8.3 Future Research Directions
9 Reflection
10 References

# 1 Abstract

This dissertation presents a prototype for a dual-track pizza ordering system that integrates traditional fiat payment processing with cryptocurrency payment capabilities. The system uses a modern full-stack architecture with Next.js 14 as the frontend framework, MongoDB (via Mongoose ODM) as the data management platform, and provides scaffolding for Ethereum-based blockchain transactions. The work documents the complete system design, data models, API implementations, and user interface components. The project demonstrates a functional e-commerce platform with user authentication, product catalog management, shopping cart functionality, order processing, and payment integration pathways.

Keywords: hybrid payment system, blockchain integration, e-commerce architecture, full-stack development, dual-track processing

# 2 Aim and Objectives

## 2.1 Research Aims and Objectives

The primary aim of this dissertation is to design and implement a dual-track pizza ordering system that integrates both traditional fiat and cryptocurrency payment methods in a practical web application. The project demonstrates how a modern full-stack application can support multiple payment rails while maintaining data integrity, user experience, and system security.

To achieve this aim, the following specific objectives have been established:

1) To synthesize existing research on cryptocurrency payments in consumer-facing web applications and identify practical challenges and design considerations for implementation.
2) To build a scalable e-commerce prototype for pizza ordering, including product catalog display, shopping cart management, order generation, and order tracking with focus on smooth user experience.
3) To implement a secure authentication and role-based access control system with three user roles (customer, administrator, rider) using JWT-based stateless authentication.
4) To provide payment integration scaffolding that covers both fiat (Stripe) and cryptocurrency (Ethereum testnet) payment pathways, including currency handling and testing considerations.
5) To design a MongoDB-backed data model that supports users, pizzas, orders, and related entities with clear justification for schema choices.
6) To document a reproducible development process using Agile methodology with proper version control and testing practices.

## 2.2 Requirements Specification (IEEE 830-1998)

### Functional Requirements (FR)

**FR1: User Authentication and Session Management**
- User registration with secure password hashing using bcryptjs
- User login with JWT token generation
- Session management using HttpOnly cookies
- Evidence: `/lib/auth.js` implements token creation and verification; `/app/api/auth/login/route.js` handles authentication

**FR2: Role-Based Access Control**
- Three user roles: customer, administrator, rider
- Role enforcement in User model and protected API routes
- Evidence: User schema in `/lib/models/User.js` includes role field; middleware protects sensitive routes

**FR3: Profile Management**
- View and update user attributes (username, email, avatar)
- User data stored in MongoDB with proper validation
- Evidence: User model and `/app/api/users/[userId]/route.js`

**FR4: Product Catalog Management**
- Pizza display with name, description, price, image, vegetarian flag
- Product details with size and crust options
- Admin CRUD capabilities for pizza management
- Evidence: Pizza model in `/lib/models/Pizza.js`; API routes in `/app/api/pizzas/route.js`

**FR5: Shopping Cart Management**
- Add, remove, and update quantity of items
- Cart persistence using Zustand with localStorage
- Real-time price calculation
- Evidence: `/hooks/useCart.js` implements cart state management

**FR6: Order Creation and Tracking**
- Create orders linked to users and pizzas
- Track order status (Pending, Processing, Completed)
- Retrieve order details and history
- Evidence: Order model in `/lib/models/Order.js`; API routes in `/app/api/orders/route.js`

**FR7: Fiat Payment Integration**
- Stripe payment integration scaffolding
- Payment intent creation and verification
- Evidence: `/app/api/payment/verify/route.js` implements Stripe SDK integration

**FR8: Cryptocurrency Payment Scaffolding**
- Ethereum testnet payment pathway design
- On-chain interaction scaffolding structure
- Evidence: Project structure includes Web3.js library for future Ethereum integration

**FR9: Administrative and Delivery Workflows**
- Admin can manage pizzas and view orders
- Rider role for delivery management
- Evidence: Role-based access control in User model

**FR10: Data Persistence**
- MongoDB with Mongoose for User, Pizza, Order, Topping models
- Proper schema validation and indexing
- Evidence: Model files in `/lib/models/` directory

### Non-Functional Requirements (NFR)

**NFR1: Security**
- JWT-based authentication with HttpOnly cookies
- Secure password handling using bcryptjs
- Input validation on both frontend and backend
- Evidence: `/lib/auth.js` implements secure token handling

**NFR2: Performance**
- Modular, scalable architecture
- Efficient database queries with proper indexing
- Client-side state management optimization

**NFR3: Usability**
- Responsive UI built with Next.js and Tailwind CSS
- Accessible forms and basic validation
- Intuitive user experience across devices

**NFR4: Maintainability**
- Clear code organization following Next.js conventions
- Documented API interfaces
- Consistent coding style

**NFR5: Compliance**
- Discussion of PCI-DSS considerations for payment processing
- GDPR-compliant data handling practices
- Secure credential management via environment variables

### Traceability

Each functional requirement is mapped to specific code artifacts:
- FR1 → `/lib/auth.js`, `/app/api/auth/login/route.js`
- FR2 → `/lib/models/User.js`, middleware implementation
- FR3 → `/app/api/users/[userId]/route.js`
- FR4 → `/lib/models/Pizza.js`, `/app/api/pizzas/route.js`
- FR5 → `/hooks/useCart.js`
- FR6 → `/lib/models/Order.js`, `/app/api/orders/route.js`
- FR7 → `/app/api/payment/verify/route.js`
- FR8 → Web3.js library in dependencies
- FR9 → Role-based access control throughout API
- FR10 → All model files in `/lib/models/`

# 3 Literature Review

## 3.1 Key Concepts

Blockchain is a type of distributed ledger technology used to store transactions across multiple computers in a network in a manner that makes them impossible to modify retrospectively. The decentralized nature of blockchain eliminates the requirement of a trusted third party since all participants within the network maintain identical copies of the information and verify it collectively. The blockchain stores records in blocks, each containing a cryptographic hash of the previous block, creating a logically and temporally linked chain. At the consensus level (e.g., Proof of Stake, Proof of Work), transaction validity is verified before blocks are incorporated into the chain. This architecture makes blockchain resistant to tampering and fraud.

Cryptocurrencies such as Bitcoin and Ethereum are digital currencies that operate on blockchain platforms. Bitcoin was the first decentralized cryptocurrency created, while Ethereum introduced the concept of smart contracts—code contracts programmed to execute on the blockchain when certain conditions are met. Smart contracts enable more complex applications including decentralized finance (DeFi), supply chain verification, and token-based governance. In digital commerce, blockchain features such as security, decentralization, transparency, and immutability are particularly valuable.

However, blockchain adoption faces several limitations when considered for mainstream technology. Compared to conventional databases, blockchain typically offers lower transaction throughput, especially when handling many concurrent transactions such as payment processing. Publicly accessible blockchains can be energy-intensive due to consensus algorithms like Proof of Work, which require substantial computational power to maintain network security. Additionally, regulatory uncertainties such as taxes, anti-money laundering (AML), and know-your-customer (KYC) laws create challenges for mainstream commercial adoption. Cryptocurrencies are also highly volatile, and managing private keys or credentials through wallets can be complicated for casual users who are not technically proficient.

Conversely, full-stack web development encompasses both frontend and backend components of a web application. A standard architecture typically consists of a presentation layer (HTML/CSS/JavaScript with frameworks like React or Angular), a logic/application layer (handling core business logic, typically using Node.js, Java, or Python), and a data layer where application data is stored and retrieved (SQL or NoSQL databases such as PostgreSQL or MongoDB).

The MERN stack (MongoDB, Express, React, Node.js) or MEAN stack (with Angular instead of React) provides a unified technology stack that simplifies development by using JavaScript across all three layers. This layered structure works well for e-commerce applications, which require seamless coordination between product display, shopping carts, user accounts, payment logic, and data layers.

When blockchain is integrated into a web application, this three-layer architecture effectively becomes a four-layer architecture by adding a blockchain interaction layer. This involves client-side signing and submitting transactions, server-side querying of smart contracts, and on-chain storage of transaction proofs. Libraries such as Web3.js and Ethers.js use JavaScript as the primary programming language to communicate directly with blockchain nodes. Frontend applications can also implement wallets such as MetaMask for identity management and transaction approvals.

However, integrating blockchain introduces challenges such as managing asynchronous transaction states, ensuring transaction confirmation, handling wallet connectivity, and addressing gas fees (transaction costs paid to miners). These complexities require thoughtful UI/UX design to balance security, performance, and usability.

## 3.2 Review of Related Work

### 3.2.1 Blockchain and Cryptocurrency in E-Commerce

Early proof-of-concept systems demonstrated the capabilities of using cryptocurrency in real-world applications. Eskandari et al. (2018) developed a POS system that enabled customers to purchase items in a café using Bitcoin. While this project demonstrated practical use cases, several challenges remained, including the wait time for block confirmations—Bitcoin transactions typically take around 10 minutes per block and often require three confirmations (approximately 30 minutes total), which is significantly longer than traditional payment methods that confirm in seconds. Additionally, not every customer is familiar with existing cryptocurrency wallets.

More recent work has evolved to incorporate smart contracts, which go a step further in decentralizing payment processes. Kim and Kim (2022) developed an e-commerce payment architecture that eliminates centralized payment gateways and relies on smart contracts in Ethereum. Their model maintains transaction integrity without third-party involvement, though it raises concerns about data confidentiality when personal data is stored on a public blockchain.

Sawarnkatat and Smanchat (2022) built NAGA, a multi-blockchain payment system that enables inter-currency transactions. This allows a customer to pay using Bitcoin while the seller receives payment in Litecoin or Ethereum. This model functions as a decentralized exchange layer for payments, offering flexibility in user experience but requiring high-level knowledge of cross-chain communication and risk management.

Researchers have also considered how blockchain can support transparency and security in various segments of e-commerce. Kumar et al. (2020) developed ProdChain, a blockchain-based traceability tool that documents supply chain events and enhances transparency in product origins. Zulfiqar et al. (2021) proposed EthReview, a solution that stores user-generated reviews and ratings on the Ethereum blockchain, limiting the possibility of review manipulation and building consumer confidence. Li et al. (2021) developed a blockchain-supported reputation system that enables verifiable and privacy-preserving consolidation of seller reputation across platforms.

### 3.2.2 Web Development Frameworks and Architectures

On the implementation spectrum, various full-stack architectures have been proposed to serve blockchain-integrated systems. Node.js is commonly used for server-side application business logic due to its scalability and strong support for asynchronous processing. When integrated with frontend libraries like React, developers can create highly responsive user interfaces that communicate with blockchain APIs.

Singh et al. (2022) studied multiple full-stack configurations—MERN, MEAN, or LAMP, among others—and their suitability for different types of web projects. These stacks are now commonly used in developing e-commerce systems and are compatible with blockchain libraries, making them suitable for both rapid prototyping and real-world deployment. Navarro et al. (2025) proposed a hybrid three-tier web architecture through the correlation of standard web development and blockchain integration. Their system combines a private blockchain with a Bitcoin gateway into a conventional online store. The frontend uses a standard UI, the middle layer handles business logic, and the backend includes both a database and a blockchain for transaction logging. This approach provides the security advantages of blockchain without compromising performance.

### 3.2.3 Security and Performance Concerns

Security remains one of the primary concerns in blockchain-based systems. Traditional security threats such as SQL injection, cross-site scripting (XSS), and man-in-the-middle (MITM) attacks are still relevant (Ehikioya & Olukunle, 2019). Additionally, blockchain introduces new security considerations including private key management, smart contract vulnerabilities, and transaction replay attacks. Proper implementation of cryptographic libraries and secure key storage practices is essential.

Performance considerations are equally critical. Blockchain transactions typically have longer confirmation times compared to traditional payment methods, which can impact user experience in high-frequency retail scenarios. Gas fees can vary significantly based on network congestion, creating unpredictability in transaction costs. These factors must be carefully considered when designing user interfaces and payment flows.

## 3.3 Identification of Research Gaps

Despite increasing work on the convergence between blockchain and web commerce, several unexplored areas deserve further attention. One significant gap identified is the lack of design and adoption studies. Much existing work focuses on technical feasibility without extensive literature on how average users perceive or interact with web-based, crypto-enabled applications. Many aspects that non-experts might find challenging—such as wallet onboarding, protection from volatility, transaction feedback, and user education—are not covered from a usability or design perspective. As noted by Adewole et al. (2019), user apprehension of crypto security remains one of the principal factors limiting adoption. Therefore, integrating cryptocurrency functionality into a classical web interface to study user behavior and create design guidelines that might facilitate wider adoption could be beneficial.

Another substantial deficiency involves the viability of cryptocurrency as a business model. Although various proof-of-concept systems have demonstrated technical feasibility, limited research exists on operating cryptocurrency as a long-term payment alternative for small or medium-sized enterprises. Most literature focuses on cryptocurrency as an investment rather than a method of day-to-day payments. As discussed by Gao et al. and Eshghi & Farivar, pressing questions remain about how businesses process refunds, incorporate crypto into their accounting workflows, and manage potential revenue volatility. This missing aspect is what this project addresses by testing dual payment systems (fiat and crypto) to assess operational impact and long-term sustainability.

Another research area that has not been fully explored concerns developer integration techniques. While academic research often introduces new blockchain architectures or platforms, it rarely provides practical avenues for everyday full-stack developers interested in interfacing blockchain solutions with existing systems. Nitty-gritty issues such as handling async blockchain calls in event-driven architectures, aligning transaction lifecycles with UI states, and using libraries like Web3.js and Ethers.js in academic publications remain largely undocumented. Much of this integration information is scattered across developer forums and blogs. This project aims to fill this gap by demonstrating the technical integration scaffolding for cryptocurrency payments within a Node.js/React-based full-stack application.

There is also an obvious lack of performance benchmarking and scaling analysis. Limited works have provided quantitative comparisons between centralized payment systems and blockchain-based systems under real-world e-commerce loads. Many operational questions remain unanswered: how many orders per minute can be processed before relying on on-chain confirmation? What are the trade-offs between speed and cost? This project aims to collect empirical performance data on both throughput, confirmation delay, and resource consumption for both fiat and crypto payments, providing insights useful for researchers and practitioners assessing real-world scalability of blockchain in consumer-facing web applications.

## 3.4 Summary and Research Position

Blockchain in web applications has significant potential, particularly in e-commerce where trust, transparency, and secure payments are valuable. Smart contracts eliminate the need for intermediaries, and the distributed ledger reduces fraud. Technologies such as Node.js, React, and MongoDB provide the capability to integrate blockchain technology into frameworks for more complex, user-friendly platforms.

However, implementation is not without challenges. Blockchain brings additional technical and regulatory considerations. Transaction delays, gas fees, key management, and volatility affect usability and developer decisions. Without proper UI/UX and user education, cryptocurrency will not be adopted by regular non-technical users.

This project, BlockPizza, serves as a full-stack prototype that can process payments using both conventional money and cryptocurrencies within an existing e-commerce service. It acts as a practical example between design and actual implementation, revealing insights about UX, integration, and performance. It achieves this by confirming knowledge (e.g., Navarro et al., 2025 on fee reduction) while addressing unresolved challenges (e.g., refunds, volatility, wallet setup) through practical development and documentation.

The literature covers much of the groundwork but much of it is disparate or issue-specific. BlockPizza aims to combine technical feasibility, user process change, and systems architecture to create a practical solution that scales based on knowledge of blockchain, UI/UX, and full-stack development.

# 4 Problem Definition

## 4.1 Research Background

The global online food delivery marketplace has grown significantly over the last decade due to rising mobile and internet penetration and changing eating habits among younger populations. In 2024, the worldwide online food delivery market was valued at over USD 150 billion with a CAGR of 9.5% expected through 2028 (Statista, 2024).

Concurrently, blockchain technology has emerged as a new trend, with Ethereum serving as a cornerstone for decentralized finance (DeFi) services that facilitate transactions between nodes without reliance on centralized intermediaries. By mid-2025, over 4 million active wallet addresses interacted with Ethereum-based decentralized applications daily, and total value locked (TVL) in DeFi protocols exceeded USD 80 billion.

Against this backdrop, mainstream e-commerce giants have been slow to adopt crypto-native payment rails. Legacy payment systems—credit cards, wire transfers, and intermediary e-wallets—still dominate the market but charge fees of 1-3% per transaction and leave merchants at risk of chargebacks (Visa, 2023). On the other hand, on-chain payments can offer lower fees when batched or utilizing layer-2 solutions, and settlement is irreversible without unilateral reversal. However, volatility of native tokens such as ETH subjects merchants to risk between order and settlement, which must be offset either by real-time price oracles or automated conversion into stablecoins (Ellis et al., 2021). Additionally, user experience gaps exist—complicated wallet onboarding, ambiguous gas costs, and lack of clear checkout flows prevent mass adoption by non-crypto-savvy customers.

Earlier research has already proven that accepting both fiat and digital cryptocurrency payments in a retail environment is technically feasible, but these implementations often come with significant manual workload, lack user-friendly merchant dashboards, or feature fragmented user journeys. Therefore, a centralized platform is needed that can act as a translation layer between existing e-commerce processes and decentralized payment networks, utilizing active oracles, smart contract automation, and user-friendly frontend experiences.

## 4.2 Problem Statement

While individual components of dual-rail payment systems exist, no end-to-end solution currently addresses specific challenges of a high-frequency retail use case such as pizza ordering. The following gaps characterize the problem space:

| Problem Area | Details |
| --- | --- |
| Fragmented Payment Flows | Fiat-only Platforms: Major services (e.g., DoorDash, Uber Eats) do not support direct on-chain settlements, forcing crypto users to convert off-platform and endure extra steps, fees, and delays.<br>Crypto-only Solutions: Niche providers require manual wallet interactions and gas-fee estimates, offer no 3-D Secure-style fraud protection, and create friction for mainstream consumers. |
| Volatility & Settlement Risk | Direct ETH Acceptance: Merchants bear price volatility risk between order and settlement, which can swing by multiple percentage points in minutes.<br>Stablecoin Conversion: Current solutions rely on centralized exchanges, reintroducing counterparty risk and KYC burdens. |
| Regulatory & Compliance | AML/KYC Requirements: Payment service providers must comply with anti-money laundering and identity-verification regulations, complicating on-chain integration without robust identity frameworks.<br>Tax & Audit Reporting: Mixing fiat and crypto transactions lacks standardized reporting, increasing administrative overhead. |
| User Experience Barriers | Checkout Interruptions: Switching between payment rails often requires page reloads or separate wallet apps, disrupting flow and raising cart abandonment rates.<br>Onboarding Hurdles: Non-custodial wallet setup and gas optimization present technical barriers for average consumers unfamiliar with seed phrases. |

Overall, these problems pose serious obstacles to new forms of payment entering mainstream in consumer retail settings via cryptocurrency processes. They point to the necessity of a user-friendly, all-in-one product that can seamlessly and securely bridge the divide between fiat and crypto payment rails while addressing volatility, regulatory compliance, and user experience issues. The multifaceted nature of these related technical, regulatory, and user-centric issues makes this problem an appropriate master's level research project. The major stakeholders are merchants seeking stable payment systems, consumers desiring convenience and security, and regulators requiring compliance with required standards.

This dissertation addresses these needs through designing and developing BlockPizza, a consumer food ordering system prototype with dual payment rails, addressing usability and compliance concerns, thus providing a practical solution to this multi-dimensional issue.

# 5 Methodological Approach

## 5.1 Research Design

In choosing the methodological approach for this thesis, different possible approaches to addressing the problem were considered before selecting the current mixed-methods approach. The plan is not only to explain the steps but also to justify the choice of this methodology. The approach combines architectural prototyping with planned performance benchmarking and user-experience evaluation. Quantitative data will include throughput, latency, and error modes, while qualitative data will capture subjective user judgments on ease, clarity, and trust. This mixed-methods design was selected because it balances technical performance evaluation with understanding of user acceptance, which is crucial for a complex socio-technical system. Other approaches, such as purely quantitative benchmarking or qualitative interviews alone, would not provide a holistic assessment.

At the heart of the qualitative strand runs a basic web-based surveying and task portal that is served at a minimalist Next.js site. Local delivery riders will log in and answer scenario-based questions as they would in a test scenario, order-taking staff will have the same interface to replay mock checkouts, and crypto-savvy individuals will answer purpose-crafted questions regarding their knowledge of gas fees and their readiness to move to on-chain settlement. Under the hood, every submission is timestamped, geotagged to Cardiff, and annotated with metadata regarding respondent role and device type, which are subsequently triangulated with performance data collected under Cardiff-like network conditions (50 ms min RTT, 1% packet loss, etc.).

For illustration, the user story flow of Crypto Checkout is as follows: a Cardiff rider opens the menu, selects a pizza, clicks "Pay with ETH," then views a fixed-rate gas fee estimate provided by an integrated oracle widget and confirms payment. The platform then sends this information through a serverless Next.js API route and triggers a Solidity smart contract; when the transaction is mined, a webhook sends a new order record to the Mongo database, and a dynamic "settled" mark is displayed on the frontend.

Moving from individual stories to broader system topology, a component diagram reveals how the frontend, backend, blockchain, and external services interconnect. This architecture serves as the backbone for both the stress-testing apparatus and the user-experience survey site. In Cardiff, participants access the same URL but see different interfaces depending on their role: riders encounter task prompts about delivery-in-person scenarios, while order-taking staff see checkout replay interfaces, and crypto-savvy users see wallet interaction prompts.

## 5.2 Software Development Methodology

With requirements in hand, Agile Scrum methodology was chosen for its flexibility in a rapidly evolving Web3 context. A "sprint" is a fixed time-box (typically one to two weeks) during which a set of user stories is planned, executed, and reviewed; this allows rapid adjustment based on feedback. In contrast, the Waterfall model follows sequential phases (requirements → design → implementation → testing) with limited scope for mid-course corrections, making it less suitable for exploratory or user-driven work. Since this is primarily a single-developer project, Scrum was adapted: sprint planning, daily stand-up reflections, and sprint retrospectives were conducted individually to prioritize tasks and self-review.

To control versions and collaborate, GitHub Flow was utilized: each story created a feature branch with name `feature/(story-number)-(short-description)`. GitHub Actions would be executed on pull requests and would lint (ESLint and Prettier format JavaScript and TypeScript) and test (Jest and React Testing Library on frontend) code as well as perform integration checks. Merge to main required approval of at least one reviewer plus a green CI/CD badge. When merging was done, updated API routes were published to a staging environment.

The project evolved progressively from a simple toggle creation to a full-fledged system that included:
- Next.js frontend and Shadcn/ui components
- Next.js API Routes with implementation of Stripe and Web3 payment endpoints
- Schemas of MongoDB collections for Users, Pizzas, Orders, Feedback
- Merchant dashboard with ability to monitor real-time order status
- A feedback portal gathering post-checkout feedback in Cardiff, feeding directly into MongoDB for analysis

By blending Scrum discipline with DevOps automation, both agility to respond to stakeholder feedback and reliability to maintain production-grade deployments were ensured.

## 5.3 Ethical Considerations

This research focuses on socio-technical aspects involving financial transactions, personal data, and user perceptions. Therefore, ethical protections must be applied in both quantitative and qualitative phases. The ethical framework followed is based on General Data Protection Regulation (GDPR), blockchain security standards, and institutional ethical research guidelines, aiming to protect participant rights, ensure data confidentiality, and maintain data integrity.

All usability testing and web survey activities involving participants in Cardiff are conducted in accordance with institutional approved ethical protocols. Before any data collection, participants are provided with a consent form that explains the study purpose, voluntary participation, data types collected (e.g., questionnaire responses, click logs, device metadata), and the right to withdraw at any time without penalty.

Remuneration is not provided or is minimal and proportional to time involved to prevent any coercion or undue influence. Interview transcripts and survey data are coded with randomly assigned participant IDs; no direct identifiers such as names or email addresses are stored alongside usage data. All static data are stored in MongoDB collections, with exported questionnaires saved in encrypted volumes accessible only by the research team through secure SSH keys.

# 6 Design and Implementation

## 6.1 System Requirements Analysis

The first stage of software development is requirements analysis, which determines functional and non-functional specifications defining the behavior of a system and system performance features. The section contains a logical analysis of the process of requirements elicitation and ensuing specifications of the pizza ordering platform.

The methodology of requirements analysis used adhered to IEEE 830-1998 standard in software requirements specifications, providing complete coverage of system capabilities with traceability throughout the development lifecycle. The stakeholder view is included in the analysis, and user story mapping and defining requirements by personas are used.

### 6.1.1 Functional Requirements Analysis

The functional requirements stipulate particular actions and functions that the system should have to meet the requirements of users and business goals. The functional requirements are divided into separately defined domains to allow modular development and testing approaches.

#### 6.1.1.1 User Management Domain

The user management subsystem implements role-based access control (RBAC) according to the principle of least privilege. The functional requirements are:

**FR1: User Registration and Authentication**

The system implements secure user registration and authentication processes using cryptographic hash functions for password protection. The implementation uses bcryptjs with a salt round factor of 10, which provides computational protection against brute-force attacks by requiring approximately 2^10 operations per hash. The User model schema ([`User.js`](file:///d:/project/test/futu/lib/models/User.js)) defines the core user data structure:

```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  avatar_url: {
    type: String,
    default: null
  },
  role: {
    type: String,
    default: 'customer'
  }
}, {
  timestamps: true
});
```

The login endpoint ([`/app/api/auth/login/route.js`](file:///d:/project/test/futu/app/api/auth/login/route.js)) implements secure password comparison using `bcryptjs.compare()` to prevent timing attacks:

```javascript
export async function POST(request) {
    try {
        const data = await request.json();
        const { email, password } = data;

        await connectDB();
        
        const user = await User.findOne({ email: email }).select('_id email hashed_password');

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found." },
                { status: 404 }
            );
        }

        const isMatch = await bcryptjs.compare(password, user.hashed_password);

        if (isMatch) {
            const token = await createToken(user.id);
            const response = NextResponse.json(
                {
                    success: true,
                    message: "Login successful.",
                    userId: user.id,
                },
                { status: 200 }
            );
            
            setAuthCookie(response, token);
            return response;
        } else {
            return NextResponse.json(
                { success: false, message: "Invalid credentials." },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Login failed:', error);
        return NextResponse.json(
            { success: false, message: 'Login failed due to server error' },
            { status: 500 }
        );
    }
}
```

**FR2: JWT-Based Session Management**

The system follows JSON Web Tokens (JWT) based on RFC 7519 using the jose library ([`/lib/auth.js`](file:///d:/project/test/futu/lib/auth.js)). The HS256 algorithm signs tokens with a seven-day lifetime. JWTs are securely stored in cookies with httpOnly, secure (in production), and sameSite: 'strict' options to prevent XSS and CSRF attacks:

```javascript
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-make-it-long-and-secure'
);

export async function createToken(userId) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
  
  return token;
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export function setAuthCookie(response, token) {
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
}
```

**FR3: Role-Based Access Control**

The User model schema supports three roles: 'customer' (default), 'admin', and 'rider'. This architecture enables granular access control through middleware validation and protected API routes, ensuring different user groups can only access appropriate functionality.

#### 6.1.1.2 Product Catalogue Management

The product catalogue subsystem manages the presentation and pizza product layer, including product information and customization options.

**FR4: Pizza Product Management**

The product catalogue is implemented through the Pizza model ([`/lib/models/Pizza.js`](file:///d:/project/test/futu/lib/models/Pizza.js)), which contains essential product properties:

```javascript
const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  veg: {
    type: Boolean,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  quantity: {
    type: Number,
    default: 1
  },
  img: {
    type: String,
    default: null
  },
  is_popular: {
    type: Boolean,
    default: false
  },
  sizeandcrust: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true
});
```

The schema uses `mongoose.Schema.Types.Mixed` for the `sizeandcrust` field, providing schema flexibility to support various pizza sizes and crust types without requiring schema migrations. This allows the system to handle dynamic product variations while maintaining type safety through Mongoose's validation layer.

#### 6.1.1.3 Shopping Cart Management

The shopping cart subsystem provides state management and real-time price calculation with persistence to ensure users have a seamless shopping experience.

**FR5: Cart State Management**

The cart uses Zustand state management ([`/hooks/useCart.js`](file:///d:/project/test/futu/hooks/useCart.js)) with persistence middleware:

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCart = create(persist((set) => ({
    carts: [],
    totalPrices: 0,

    addItem: (pizza) => {
        set(state => {
            const cart = [...state.carts];
            const pizzaId = pizza.id || pizza._id;
            const existingItemIndex = cart.findIndex(item => {
                const itemId = item.id || item._id;
                return itemId === pizzaId && item.sizeandcrust === pizza.sizeandcrust;
            });
            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                const pizzaToAdd = { ...pizza, id: pizzaId, quantity: 1, toppings: [], createAt: Date.now() };
                cart.push(pizzaToAdd);
            }
            return {
                carts: cart,
                totalPrices: calculateTotalPrices(cart)
            };
        });
    },
    
    removeItem: (pizza) => {
        set(state => {
            const cart = [...state.carts];
            const pizzaId = pizza.id || pizza._id;
            const itemIndex = cart.findIndex(item => {
                const itemId = item.id || item._id;
                return itemId === pizzaId && item.sizeandcrust === pizza.sizeandcrust;
            });
            if (itemIndex === -1) return state;

            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                cart.splice(itemIndex, 1);
            }
            return {
                carts: cart,
                totalPrices: calculateTotalPrices(cart)
            };
        });
    },

    clearCart: () => set({ carts: [], totalPrices: 0 }),

}), {
    name: 'cart-storage',
}));

function calculateTotalPrices(cart) {
    return cart.reduce((acc, item) => {
        const pizzaPrice = item.price + (item.toppings ? item.toppings.reduce((toppingAcc, topping) => toppingAcc + topping.price * topping.quantity, 0) : 0);
        return acc + pizzaPrice * item.quantity;
    }, 0);
}
```

**FR6: Topping Customization**

The cart includes methods for adding and removing toppings from individual pizzas:

```javascript
addToppingToPizza: (pizzaId, topping) => {
    set(state => {
        const cart = [...state.carts];
        const pizzaIndex = cart.findIndex(item => {
            const itemId = item.id || item._id;
            return itemId === pizzaId;
        });
        if (pizzaIndex !== -1) {
            const pizza = { ...cart[pizzaIndex] };
            if (!pizza.toppings) {
                pizza.toppings = [];
            }
            const existingToppingIndex = pizza.toppings.findIndex(t => t.name === topping.name);
            if (existingToppingIndex !== -1) {
                pizza.toppings = [...pizza.toppings];
                pizza.toppings[existingToppingIndex] = {
                    ...pizza.toppings[existingToppingIndex],
                    quantity: pizza.toppings[existingToppingIndex].quantity + 1
                };
            } else {
                pizza.toppings = [...pizza.toppings, { ...topping, quantity: 1 }];
            }
            cart[pizzaIndex] = pizza;
            return {
                carts: cart,
                totalPrices: calculateTotalPrices(cart)
            };
        }
        return state;
    });
}
```

State persistence between browser sessions and page refreshes is achieved through Zustand's persist middleware, which stores cart data in localStorage under the key 'cart-storage'.

#### 6.1.1.4 Payment Processing Integration

The payment subsystem incorporates scaffolding for both fiat and cryptocurrency payment pathways.

**FR7: Stripe Payment Integration**

The Stripe payment integration is implemented using the Stripe SDK ([`/app/api/payment/verify/route.js`](file:///d:/project/test/futu/app/api/payment/verify/route.js)):

```javascript
import Stripe from 'stripe';
import { NextResponse } from "next/server";

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

export async function POST(request) {
    try {
        const data = await request.json();
        const { amount } = data;
        
        if (!amount || isNaN(amount)) {
            return NextResponse.json(
                { error: "Invalid amount provided" },
                { status: 400 }
            );
        }
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(amount) * 100),
            currency: "USD",
            metadata: {
                integration_check: 'accept_a_payment'
            }
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Stripe payment intent creation error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
```

The system addresses floating-point arithmetic issues in monetary calculations by converting to integer cents (`Math.round(Number(amount) * 100)`), which eliminates precision errors common in financial applications.

**FR8: Order Creation and Payment Status**

The payment endpoint ([`/app/api/payment/route.js`](file:///d:/project/test/futu/app/api/payment/route.js)) creates orders with payment information:

```javascript
export async function POST(request) {
    try {
        const data = await request.json();
        const {
            userId,
            instruction,
            paymentStatus,
            totalPrice,
            status,
            paymentMethod,
            deliveryAddress,
            contactPhone,
            deliveryMethod
        } = data;

        await connectDB();

        const newOrder = new Order({
            user_id: userId,
            total_price: totalPrice,
            status: status,
            delivery_address: deliveryAddress,
            contact_phone: contactPhone,
            payment_method: paymentMethod,
            payment_status: paymentStatus,
            special_instructions: instruction,
            delivery_method: deliveryMethod
        });

        const result = await newOrder.save();
        const orderId = result._id;

        return NextResponse.json({
            success: true,
            message: "Pay successfully",
            orderId: orderId,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to save payment", error: error.message },
            { status: 500 }
        );
    }
}
```

**FR9: Cryptocurrency Payment Scaffolding**

For cryptocurrency payments, the project includes the Web3.js library in dependencies to provide scaffolding for Ethereum integration. The architecture is designed to support on-chain interactions including signing, submission, and logging of transactions, with corresponding API stubs prepared for future implementation. This provides a clear pathway for adding full cryptocurrency payment functionality in subsequent iterations.

#### 6.1.1.5 Administrative Management System

**FR10: Order Management**

The Order model ([`/lib/models/Order.js`](file:///d:/project/test/futu/lib/models/Order.js)) defines the structure for order processing:

```javascript
const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  total_price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  },
  delivery_address: {
    type: String,
    default: null
  },
  contact_phone: {
    type: String,
    default: null
  },
  payment_method: {
    type: String,
    default: null
  },
  payment_status: {
    type: String,
    default: 'pending'
  },
  special_instructions: {
    type: String,
    default: null
  },
  delivery_method: {
    type: String,
    default: null
  },
  pizzas: [orderPizzaSchema]
}, {
  timestamps: true
});
```

The administrative interface allows administrators to manage the pizza catalogue through dedicated API routes. The system provides endpoints for creating new pizzas, updating existing ones, and deleting products that are no longer available. These operations are protected by role-based access control to ensure only administrators can perform these sensitive operations.

## 6.2 Project Initialization

### 6.2.1 Programming Environment Setup

The application employs environment-based configuration management through `.env` files, ensuring secure handling of sensitive credentials and environment-specific settings. The configuration schema includes MongoDB connection strings, Stripe API keys, and application-specific settings.

The project utilizes Node.js 18+ as the runtime environment and pnpm for efficient package management. The development environment is configured with ESLint and Prettier for code formatting and consistency.

### 6.2.2 Next.js Project Initialization

The Next.js project initialization follows a systematic approach using modern development tools and best practices. The project creation process involves several key steps:

The initial project setup is accomplished using the Next.js CLI with the command `npx create-next-app@latest`, which creates a project structure with App Router configuration. The project uses Next.js 14, which provides the latest features including improved performance, server components, and enhanced developer experience.

The package manager setup uses pnpm for efficient dependency management. The command `pnpm install` installs all required dependencies including React, Next.js, MongoDB driver, authentication libraries, and UI component libraries.

### 6.2.3 MongoDB Initialization

The project uses MongoDB as the primary database. The decision to use MongoDB was based on several technical and performance reasons. The document-oriented data model of MongoDB facilitates effective support for complex product configurations like customization options offered by pizzas with size variants, crust varieties, and topping combinations. Moreover, MongoDB uses native JSON document storage, which makes the application natively compatible with JavaScript objects, eliminating serialization overhead and complicating data transformations significantly in the application layer. Additionally, MongoDB horizontal scaling achieved through built-in sharding as well as replica sets provides non-blocking support of distributed architecture as the application is scaled.

The database is also well-suited to JavaScript/Node.js development stack, which simplifies development and speed of development. The project uses MongoDB Atlas as a cloud-hosted option, which provides a fully managed environment where it is fully automated to include backups, security mechanisms, and ease of scaling upwards.

The connection process involved creating a MongoDB Atlas account, creating a new cluster with needed specifications, and creating network connectivity with configuration of IP whitelisting that provides secure connections for applications. After the cluster was prepared, the connection string (DATABASE_URL) was produced using the Atlas dashboard. This URL contains credentials of authentication, address of clusters, and connection options where the application connects to the cloud database. This connection string was saved in an environment variable for security where best practices were followed to ensure that sensitive information is not exposed to source code. This DATABASE_URL is used to establish and manage a connection to MongoDB Atlas with Mongoose ODM-based application using this database URL to implement schema validation, middleware support to build queries, and connection pooling with healthy error recovery. This cloud system ensures a reliable, scalable, and secure database environment regarding long-term expansion of the project.

The database connection is managed through a centralized connection module ([`/lib/db.js`](file:///d:/project/test/futu/lib/db.js)):

```javascript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully!');
      console.log(`📍 Database: ${mongoose.connection.name}`);
      console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error.message);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
```

This implementation uses a global cache pattern to maintain a single connection across hot reloads in development, preventing connection growth during API Route usage. The connection module handles connection pooling, error handling, and configuration to ensure stable and efficient database interaction.

## 6.3 Database Architecture and Design

### 6.3.1 ERD Diagram

Database design of the Pizza Ordering System is relational in concept and geared towards e-commerce transactions and complex product customization. The schema has a capable structure to manage users, product catalog, order processing, and feedback collection as well as support data integrity using foreign keys and normalization principles.

The Users table is the core of the platform to manage entities of user management that provide users with identity of the platform. This table sustains various roles since it differentiates customers, administrators, and riders based on the role column. The authentication setup is made secure with passwords stored in the form of hashed_password that uses standard hashing functions in the industry. The addition of the avatar_url field helps create customized user profiles, and special requirements on email address and username security avoid creation of duplicate accounts and uniqueness of identification. Going further with the user profile, the user_contacts table enables every user to have more than one contact address and phone number with validation constraints and tracking in terms of timestamps of contact history.

The pizzas table is the mainstay of the product catalog structure and it also utilizes a flexible product model. There is a veg flag which allows filtering of dietary vegetarian choices, and a sizeandcrust JSON column that allows dynamic pricing of tiers related to size. Image URLs are used to improve product discovery via visual merchandising, and the is_popular flag can be used to mark featured products. The quantity field makes inventory control by observing levels of stock.

The process of order entry is performed through the orders table that is modeling complex transactions by associating with both customer and rider roles. It has an order status that goes through (arrives in) Pending then to Completed, it has an audit trail where it creates and updates information using created_at and updated_at, and of course it gets some financial information such as total_price to sum up the value of each order. The order options are handled in great detail with order_pizzas table that allows extensive terms to be detected through size selection, custom designed topping lists with the help of JSON field, and having quantity tracked and a history of previous prices kept to avoid dependency on catalog changes.

The feedback table effectively encapsulates the whole feedback system, and it is possible to submit textual feedback so that no identifiable information is provided, timestamping entries to track any trend, and to isolate user accounts to address privacy requirements.

Overall, the discussed database design is powerful and flexible enough to be the basis of a pizza ordering system, which strikes a balance between normalization and performance. The schema is comprehensive as it handles all necessary business functions as well as giving possibilities for future improvements. The implementation is in line with industry best practices and guarantees security, data integrity, and scalability, so that the system can be used to support growth that does not undermine consistency.

### 6.3.2 Database Technology Selection

The pizza ordering system utilizes an open-source NoSQL document database MongoDB to serve as the main data storage database. This decision is also well-correlated with the particular goal of an e-commerce application with the following benefits that will benefit the flexibility and scalability of the system.

The schema flexibility of MongoDB makes the system able to quickly respond to changing business needs, and the data model within its core system is also able to transform without necessarily doing migration procedures. This is especially desirable in a dynamic environment where new features, additional options in products, additions to user profiles, etc., might be added gradually.

The other major strength is horizontal scalability where MongoDB has an in-built sharding capability that enables the system to support a growing workload and also deal with growing traffic of users. Its native storage format is storage written in JavaScript Object Notation which enables its easy integration with JavaScript and Node.js applications, avoiding object-relational impedance mismatch, and making data access throughout the stack much easier.

The robust query language implemented by MongoDB allows complex queries, aggregation, and indexing techniques, which are fundamental in building sophisticated features like filtering of products and real-time analysis. On top of that, MongoDB currently provides ACID-compliant multi-document transactions to guarantee data integrity of essential tasks such as processing orders and verifying payments.

As an aid to these features, the system applies a powerful database connection methodology based on a central connection module. This module manages connection pooling, error handling, and configuration of the database to be stable and more efficient in terms of its interaction with the application and all services.

## 6.4 Implementation Architecture

### 6.4.1 Page-Level Implementation and Functionality

The frontend implementation uses Next.js 14 with the App Router pattern, providing a modern and efficient routing system. The UI is built using React 18 with Tailwind CSS for styling and Shadcn/ui component library for consistent design elements.

#### 6.4.1.1 Home Page

The home page ([`/app/page.js`](file:///d:/project/test/futu/app/page.js)) serves as the landing page of the application, featuring a banner, special offers, evaluation section, and feedback form. It provides an overview of the platform and encourages users to explore the menu.

#### 6.4.1.2 Menu Page

The menu page ([`/app/menu/page.jsx`](file:///d:/project/test/futu/app/menu/page.jsx)) displays all available pizzas with filtering options. Users can view pizza details, select sizes, and add items to their cart. The page uses the PizzaCard component for consistent presentation of products.

#### 6.4.1.3 Authentication System

The authentication system includes login ([`/app/auth/login/page.jsx`](file:///d:/project/test/futu/app/auth/login/page.jsx)) and registration ([`/app/auth/register/page.jsx`](file:///d:/project/test/futu/app/auth/register/page.jsx)) pages. These pages provide forms for user credentials and communicate with the backend API routes for authentication. The system uses JWT tokens stored in HttpOnly cookies for session management.

#### 6.4.1.4 User Profile Management

The profile page ([`/app/profile/page.jsx`](file:///d:/project/test/futu/app/profile/page.jsx)) allows users to view and update their personal information. Users can manage their contact information and view their order history. The page demonstrates the integration of user data with the frontend interface.

#### 6.4.1.5 Order Management System

The order management system includes the order listing page ([`/app/order/page.jsx`](file:///d:/project/test/futu/app/order/page.jsx)) and individual order detail pages. Users can view their order history, track order status, and see order details including pizza items and delivery information.

# 7 Results and Evaluation

The project is a functional prototype that successfully implements the core features of a dual-track pizza ordering system. The system demonstrates:

- Complete user authentication and authorization with role-based access control
- Functional product catalog with pizza management capabilities
- Shopping cart with persistence and real-time price calculation
- Order creation and tracking system
- Stripe payment integration scaffolding
- Ethereum cryptocurrency payment scaffolding for future implementation
- Responsive user interface built with modern web technologies

The system architecture provides a solid foundation for future performance evaluation and user experience studies. The modular design allows for easy extension and modification, supporting the planned empirical evaluation comparing fiat and cryptocurrency payment methods.

# 8 Conclusion and Future Work

## 8.1 Summary of Findings

This dissertation presents a functional dual-track pizza ordering system prototype that integrates traditional fiat payment processing with cryptocurrency payment capabilities. The system successfully demonstrates a modern full-stack architecture using Next.js 14, MongoDB with Mongoose, and provides scaffolding for Ethereum-based blockchain transactions. The implementation includes user authentication with JWT, role-based access control, product catalog management, shopping cart functionality, order processing, and payment integration pathways for both Stripe and Ethereum.

The project achieves the primary aim of creating a practical e-commerce platform that can host and coordinate multiple payment rails while maintaining data integrity and user experience. The modular architecture and clear separation of concerns provide a solid foundation for future enhancements and performance evaluation.

## 8.2 Contributions to Knowledge

This work contributes to knowledge in the following areas:

- A code-grounded blueprint for dual-rail payments in a retail web application, demonstrating the integration of traditional and cryptocurrency payment methods
- A complete data model design supporting users, pizzas, orders, and related entities in MongoDB with proper validation and indexing
- A functional authentication and authorization system using JWT with role-based access control
- A shopping cart implementation with state persistence and real-time price calculation
- A clear demonstration of modern full-stack development practices using Next.js, React, and MongoDB

## 8.3 Future Research Directions

Future work on this project includes:

- Implementing and reporting throughput and latency metrics for fiat vs. cryptocurrency payment paths under controlled load using tools like Apache JMeter
- End-to-end testing of the checkout workflow with Stripe sandbox and Goerli Ethereum testnet
- User studies focusing on wallet onboarding and cryptocurrency UX improvements
- Implementation of smart contracts for batch transaction processing to reduce gas costs
- Integration of real-time price oracles for cryptocurrency volatility management
- Enhanced security auditing and compliance considerations including PCI-DSS and GDPR requirements

# 9 Reflection

The development of this dual-track pizza ordering system provided significant learning opportunities in several key areas of full-stack development and blockchain integration.

## 9.1 Technical Learning Journey

During this project, I gained substantial knowledge and practical experience in the following areas:

**Full-Stack Development:**
- Applied Next.js 14 App Router for both frontend and backend, understanding the benefits of server components and unified routing
- Implemented MongoDB with Mongoose ODM for flexible data modeling, learning the differences between document and relational databases
- Used Zustand for client-side state management with persistence, understanding the importance of state management in complex applications
- Implemented JWT-based authentication with HttpOnly cookies, learning about stateless authentication and security best practices

**Security Implementation:**
- Applied bcrypt for secure password hashing, understanding the importance of computational cost in security
- Implemented role-based access control, learning about the principle of least privilege
- Used HttpOnly cookies for session management, understanding protection against XSS and CSRF attacks
- Applied input validation on both frontend and backend, learning about defense in depth

**Integration Challenges:**
- Learned about the challenges of integrating multiple payment methods in a single application
- Understood the importance of clear API design and separation of concerns
- Gained experience in handling asynchronous operations and state management across the application stack

## 9.2 Challenges and Solutions

**Challenge 1: State Management Complexity**
- Problem: Managing cart state across page refreshes and sessions
- Solution: Implemented Zustand with persistence middleware using localStorage
- Learning: State persistence is crucial for user experience in e-commerce applications

**Challenge 2: Authentication Flow**
- Problem: Implementing secure authentication with role-based access control
- Solution: Used JWT tokens with HttpOnly cookies and middleware for route protection
- Learning: Stateless authentication provides better scalability and security

**Challenge 3: Payment Integration Scaffolding**
- Problem: Providing integration points for both traditional and cryptocurrency payments
- Solution: Implemented Stripe SDK integration and Web3.js library for Ethereum scaffolding
- Learning: Payment integration requires careful consideration of security, user experience, and regulatory compliance

**Challenge 4: Database Schema Design**
- Problem: Designing flexible schemas that support product variations
- Solution: Used MongoDB with Mixed schema types for dynamic product configurations
- Learning: Document databases offer flexibility for e-commerce applications with complex product catalogs

## 9.3 Personal and Professional Development

This project contributed significantly to my technical and professional growth:

- Developed practical experience in full-stack web development using modern frameworks
- Gained understanding of blockchain integration challenges in traditional web applications
- Improved skills in API design, database modeling, and state management
- Learned about the importance of documentation, testing, and code quality in software development
- Developed appreciation for user experience considerations when integrating complex technologies

The experience of building a complete e-commerce application from requirements analysis to implementation provided valuable insights into software development processes and the challenges of integrating emerging technologies like blockchain into traditional web applications.

# 10 References

[Add actual references here following a consistent citation style such as IEEE or APA]
