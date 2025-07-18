import { BlockData } from '@/types/blockchain';

// Generate cryptographic-looking hashes for visual effect
const generateHash = (input: string): string => {
  return '0x' + Array.from(input).map((_, i) => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('').substring(0, 64);
};

export const blockchainData: BlockData[] = [
  {
    id: 'genesis',
    blockNumber: 0,
    timestamp: '1995-03-15T00:00:00Z',
    title: 'Genesis Block',
    subtitle: 'The Origin Story',
    description: 'Every blockchain starts with a genesis block. This is where the journey began.',
    details: {
      content: `Born into the digital age, with an innate curiosity for how systems work and connect. The foundation block that would eventually lead to a passion for decentralized technologies and blockchain innovation.

Growing up during the early internet era, witnessing the transformation from dial-up connections to broadband, from static websites to dynamic applications. This early exposure to technological evolution sparked a deep interest in understanding the underlying protocols and systems that power our digital world.`,
      achievements: [
        'First computer at age 8',
        'Built first website at 12',
        'Started programming in BASIC and HTML',
        'Early adopter of internet technologies'
      ]
    },
    hash: generateHash('genesis'),
    previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    nonce: 0,
    position: { x: 0, y: 0, z: 0 }
  },
  {
    id: 'education-foundation',
    blockNumber: 1,
    timestamp: '2013-09-01T00:00:00Z',
    title: 'Education Foundation',
    subtitle: 'Building the Knowledge Base',
    description: 'Academic foundation in computer science and mathematics.',
    details: {
      content: `Pursued formal education in Computer Science with a focus on mathematics, algorithms, and system design. This period was crucial for building the theoretical foundation that would later prove invaluable in understanding blockchain consensus mechanisms, cryptographic principles, and distributed systems.

Specialized coursework included discrete mathematics, data structures, algorithms, computer networks, and database systems. Participated in programming competitions and hackathons, developing problem-solving skills and learning to work under pressure.`,
      technologies: ['C++', 'Java', 'Python', 'SQL', 'Assembly', 'MATLAB'],
      achievements: [
        'Dean\'s List for 3 consecutive semesters',
        'Winner of university programming contest',
        'Published research paper on distributed algorithms',
        'Teaching assistant for Data Structures course'
      ]
    },
    hash: generateHash('education'),
    previousHash: generateHash('genesis'),
    nonce: 1337,
    position: { x: 200, y: -100, z: 50 }
  },
  {
    id: 'degree-graduation',
    blockNumber: 2,
    timestamp: '2017-05-15T00:00:00Z',
    title: 'Bachelor\'s Degree',
    subtitle: 'Computer Science Graduate',
    description: 'Graduated with honors, specializing in distributed systems and cryptography.',
    details: {
      content: `Completed Bachelor's degree in Computer Science with magna cum laude honors. Senior thesis focused on "Consensus Algorithms in Distributed Networks" - a prescient topic that would become central to blockchain technology.

During the final year, became fascinated with Bitcoin's whitepaper and began exploring the intersection of cryptography, game theory, and distributed systems. This marked the beginning of the blockchain journey.`,
      technologies: ['Cryptography', 'Distributed Systems', 'Network Security', 'Game Theory'],
      achievements: [
        'Graduated Magna Cum Laude (GPA: 3.8/4.0)',
        'Thesis: "Consensus Algorithms in Distributed Networks"',
        'President of Computer Science Student Association',
        'Internship at tech startup working on P2P networks'
      ],
      links: [
        { label: 'Thesis Paper', url: '#', type: 'website' }
      ]
    },
    hash: generateHash('degree'),
    previousHash: generateHash('education'),
    nonce: 2048,
    position: { x: -150, y: 100, z: -30 }
  },
  {
    id: 'blockchain-entry',
    blockNumber: 3,
    timestamp: '2018-01-10T00:00:00Z',
    title: 'Blockchain Entry',
    subtitle: 'First Smart Contract',
    description: 'Wrote the first smart contract and fell down the Ethereum rabbit hole.',
    details: {
      content: `The crypto winter of 2018 was the perfect time to start learning. While prices were down, the technology was maturing. Spent countless hours reading documentation, following tutorials, and experimenting with Solidity.

First smart contract was a simple token following ERC-20 standard, but it opened up a whole new world of possibilities. Realized that blockchain wasn't just about cryptocurrency - it was about programmable money, decentralized governance, and trustless systems.`,
      technologies: ['Solidity', 'Web3.js', 'Truffle', 'Ganache', 'MetaMask'],
      achievements: [
        'Deployed first smart contract on Ethereum mainnet',
        'Built decentralized voting system',
        'Completed 100DaysOfCode challenge focused on blockchain',
        'Active contributor to Ethereum Stack Exchange'
      ],
      codeSnippet: `// My first smart contract
pragma solidity ^0.8.0;

contract MyToken {
    mapping(address => uint256) public balances;
    uint256 public totalSupply;
    
    constructor(uint256 _supply) {
        totalSupply = _supply;
        balances[msg.sender] = _supply;
    }
    
    function transfer(address _to, uint256 _amount) public {
        require(balances[msg.sender] >= _amount);
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }
}`,
      links: [
        { label: 'First Contract on Etherscan', url: '#', type: 'website' }
      ]
    },
    hash: generateHash('blockchain-entry'),
    previousHash: generateHash('degree'),
    nonce: 4096,
    position: { x: 300, y: 50, z: 100 }
  },
  {
    id: 'evm-chains',
    blockNumber: 4,
    timestamp: '2020-03-20T00:00:00Z',
    title: 'EVM Mastery',
    subtitle: 'Multi-Chain Development',
    description: 'Became proficient across Ethereum, Polygon, BSC, Avalanche, and Arbitrum.',
    details: {
      content: `The DeFi summer of 2020 brought explosive growth to Ethereum and the birth of alternative EVM-compatible chains. This was an incredible learning opportunity to understand how different chains optimize for different use cases.

Worked on projects across multiple chains, learning the nuances of each - Polygon's low fees, BSC's speed, Avalanche's subnets, and Arbitrum's optimistic rollups. Each chain taught valuable lessons about trade-offs in blockchain design.`,
      technologies: [
        'Ethereum', 'Polygon (Matic)', 'Binance Smart Chain', 'Avalanche', 'Arbitrum',
        'Hardhat', 'OpenZeppelin', 'Chainlink', 'IPFS', 'The Graph'
      ],
      achievements: [
        'Deployed contracts on 8+ different EVM chains',
        'Built cross-chain bridge protocol',
        'Audited 50+ smart contracts',
        'Contributed to OpenZeppelin library',
        'Speaker at 3 blockchain conferences'
      ],
      links: [
        { label: 'Multi-Chain DeFi Protocol', url: '#', type: 'github' },
        { label: 'Cross-Chain Bridge', url: '#', type: 'demo' }
      ]
    },
    hash: generateHash('evm-chains'),
    previousHash: generateHash('blockchain-entry'),
    nonce: 8192,
    position: { x: -200, y: -50, z: 80 }
  },
  {
    id: 'solana-ton',
    blockNumber: 5,
    timestamp: '2021-11-08T00:00:00Z',
    title: 'Beyond EVM',
    subtitle: 'Solana & TON Development',
    description: 'Expanded expertise to non-EVM chains: Solana (Rust/Anchor) and TON (Tact).',
    details: {
      content: `Venturing beyond the EVM ecosystem opened up new paradigms in blockchain development. Solana's account model and parallel processing required a complete shift in thinking, while TON's actor model brought lessons from Telegram's massive scale.

Learning Rust for Solana development was challenging but rewarding - the language's emphasis on memory safety and performance aligned perfectly with blockchain's requirements for security and efficiency.`,
      technologies: [
        'Rust', 'Anchor Framework', 'Solana CLI', 'Phantom Wallet',
        'Tact Language', 'TON Blockchain', 'FunC', 'TON Connect'
      ],
      achievements: [
        'Built high-frequency trading bot on Solana',
        'Developed NFT marketplace with 10K+ transactions',
        'Created TON-based gaming DApp',
        'Optimized transaction costs by 90% using Solana accounts',
        'Rust contributor to Anchor framework'
      ],
      codeSnippet: `// Solana program using Anchor
use anchor_lang::prelude::*;

#[program]
pub mod my_solana_program {
    use super::*;
    
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let account = &mut ctx.accounts.my_account;
        account.bump = *ctx.bumps.get("my_account").unwrap();
        Ok(())
    }
}`,
      links: [
        { label: 'Solana DeFi Protocol', url: '#', type: 'github' },
        { label: 'TON Gaming DApp', url: '#', type: 'demo' }
      ]
    },
    hash: generateHash('solana-ton'),
    previousHash: generateHash('evm-chains'),
    nonce: 16384,
    position: { x: 100, y: 150, z: -50 }
  },
  {
    id: 'major-projects',
    blockNumber: 6,
    timestamp: '2022-07-15T00:00:00Z',
    title: 'Major Projects',
    subtitle: 'DeFi, NFTs & GameFi',
    description: 'Led development of large-scale DeFi protocols, NFT marketplaces, and GameFi platforms.',
    details: {
      content: `This period marked the transition from learning to leading. Architected and developed several major projects that handled millions in TVL and thousands of active users.

Each project brought unique challenges: DeFi required deep understanding of financial primitives and MEV protection, NFTs demanded efficient metadata handling and royalty systems, while GameFi combined the complexity of both with real-time gaming mechanics.`,
      technologies: [
        'Advanced Solidity Patterns', 'Diamond Standard (EIP-2535)', 'Merkle Trees',
        'Layer 2 Solutions', 'MEV Protection', 'Flash Loans', 'Yield Farming',
        'ERC-721', 'ERC-1155', 'IPFS', 'Ceramic Network', 'Chainlink VRF'
      ],
      achievements: [
        'DeFi protocol with $50M+ TVL at peak',
        'NFT marketplace processing 100K+ trades',
        'GameFi platform with 50K+ daily active users',
        'Implemented gas optimizations saving users $2M+ in fees',
        'Zero critical security vulnerabilities across all projects'
      ],
      links: [
        { label: 'DeFi Protocol', url: '#', type: 'github' },
        { label: 'NFT Marketplace', url: '#', type: 'demo' },
        { label: 'GameFi Platform', url: '#', type: 'website' }
      ]
    },
    hash: generateHash('major-projects'),
    previousHash: generateHash('solana-ton'),
    nonce: 32768,
    position: { x: -100, y: -120, z: 150 }
  },
  {
    id: 'open-source',
    blockNumber: 7,
    timestamp: '2023-04-22T00:00:00Z',
    title: 'Open Source',
    subtitle: 'Community Contributions',
    description: 'Active contributor to blockchain open source projects and community initiatives.',
    details: {
      content: `Giving back to the community that enabled the learning journey. Contributing to major open source projects, maintaining popular libraries, and mentoring new developers entering the blockchain space.

Open source work includes security improvements to popular DeFi protocols, gas optimization libraries, and educational resources for developers transitioning from Web2 to Web3.`,
      technologies: [
        'GitHub Actions', 'Continuous Integration', 'Security Auditing',
        'Documentation', 'Code Review', 'Mentorship Programs'
      ],
      achievements: [
        '500+ GitHub contributions in 2023',
        'Maintainer of popular Solidity library (10K+ stars)',
        'Published security research on flash loan attacks',
        'Mentored 50+ developers through Web3 bootcamp',
        'Core contributor to 3 major DeFi protocols'
      ],
      links: [
        { label: 'GitHub Profile', url: 'https://github.com', type: 'github' },
        { label: 'Security Research', url: '#', type: 'website' },
        { label: 'Solidity Library', url: '#', type: 'github' }
      ]
    },
    hash: generateHash('open-source'),
    previousHash: generateHash('major-projects'),
    nonce: 65536,
    position: { x: 250, y: 0, z: -100 }
  },
  {
    id: 'contact',
    blockNumber: 8,
    timestamp: '2024-01-01T00:00:00Z',
    title: 'Let\'s Connect',
    subtitle: 'Available for Collaboration',
    description: 'Ready for the next blockchain challenge. Let\'s build the future together.',
    details: {
      content: `The blockchain space is constantly evolving, and I'm excited to be part of that evolution. Whether you're building the next DeFi protocol, exploring NFT utilities, or pushing the boundaries of what's possible with smart contracts, I'd love to collaborate.

I'm particularly interested in projects that combine technical innovation with real-world impact. If you're working on something that could change how we interact with money, governance, or digital ownership, let's talk.`,
      technologies: [
        'Full-Stack Blockchain Development', 'Smart Contract Architecture',
        'DeFi Protocol Design', 'Cross-Chain Solutions', 'Security Auditing',
        'Team Leadership', 'Technical Strategy', 'Product Development'
      ],
      achievements: [
        'Available for full-time positions',
        'Open to consulting opportunities',
        'Interested in co-founding innovative projects',
        'Speaking engagements at conferences'
      ],
      links: [
        { label: 'Email', url: 'mailto:dev@0xdeveloper.eth', type: 'email' },
        { label: 'LinkedIn', url: 'https://linkedin.com', type: 'linkedin' },
        { label: 'GitHub', url: 'https://github.com', type: 'github' },
        { label: 'Download Resume', url: '#', type: 'website' }
      ]
    },
    hash: generateHash('contact'),
    previousHash: generateHash('open-source'),
    nonce: 131072,
    position: { x: 0, y: 100, z: 200 }
  }
];

export const getBlockByNumber = (blockNumber: number): BlockData | undefined => {
  return blockchainData.find(block => block.blockNumber === blockNumber);
};

export const getNextBlock = (currentBlockNumber: number): BlockData | undefined => {
  return blockchainData.find(block => block.blockNumber === currentBlockNumber + 1);
};

export const getPreviousBlock = (currentBlockNumber: number): BlockData | undefined => {
  return blockchainData.find(block => block.blockNumber === currentBlockNumber - 1);
};