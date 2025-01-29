import React, { useState } from 'react';
import { ethers } from 'ethers';
import abi from './abi.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import "./index.css";

const contractAddress = '0x9B69E147c2154873E23F4EbaEE71592E610af0F6';

// Styled Components
const Container = styled.div`
  padding: 20px;
  font-family: 'Arial, sans-serif';
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const Input = styled.input`
  padding: 10px;
  margin-right: 10px;
  width: 250px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => props.bgColor || '#4CAF50'};
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.hoverColor || '#45a049'};
  }
`;

const BalanceText = styled.p`
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
`;

const App = () => {
  const [userDeposit, setUserDeposit] = useState('');
  const [userWithdrawal, setUserWithdrawal] = useState('');
  const [userBalance, setUserBalance] = useState(0);

  async function requestAccounts() {
    if (typeof window.ethereum === 'undefined') {
      toast.error('Please install MetaMask!');
      return;
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function handledeposit() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await requestAccounts();
        const providers = new ethers.BrowserProvider(window.ethereum);
        const signer = await providers.getSigner();
        const myContract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await myContract.deposit(userDeposit);
        await tx.wait();
        toast.success('Deposit Successful!');
      } catch (err) {
        console.error('Transaction Failed', err);
        toast.error('Deposit Failed. Please try again.');
      }
    }
  }

  async function handlewithdraw() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await requestAccounts();
        const providers = new ethers.BrowserProvider(window.ethereum);
        const signer = await providers.getSigner();
        const myContract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await myContract.withdraw(userWithdrawal);
        await tx.wait();
        toast.success('Withdrawal Successful!');
      } catch (err) {
        console.error('Transaction Failed', err);
        toast.error('Withdrawal Failed. Please try again.');
      }
    }
  }

  async function handlegetBalance() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await requestAccounts();
        const providers = new ethers.BrowserProvider(window.ethereum);
        const myContract = new ethers.Contract(contractAddress, abi, providers);

        const tx = await myContract.balance();
        const formattedBalance = ethers.formatEther(tx);
        setUserBalance(formattedBalance);
        toast.success('Balance Fetched Successfully!');
      } catch (err) {
        console.error('Transaction Failed', err);
        toast.error('Failed to Fetch Balance. Please try again.');
      }
    }
  }

  return (
    <Container  className='quiz-container'>
      <h1>Simple Deposit, Withdraw And View Balance DAPP</h1>

      {/* Deposit Section */}
      <div>
        <h2>Deposit</h2>
        <Input
          type="text"
          placeholder="Enter amount to deposit (ETH)"
          value={userDeposit}
          onChange={(e) => setUserDeposit(e.target.value)}
        />
        <Button bgColor="#4CAF50" hoverColor="#45a049" onClick={handledeposit}>
          Deposit
        </Button>
      </div>

      <hr />

      {/* Withdraw Section */}
      <div>
        <h2>Withdraw</h2>
        <Input
          type="text"
          placeholder="Enter amount to withdraw (ETH)"
          value={userWithdrawal}
          onChange={(e) => setUserWithdrawal(e.target.value)}
        />
        <Button bgColor="#f44336" hoverColor="#e53935" onClick={handlewithdraw}>
          Withdraw
        </Button>
      </div>

      <hr />

      {/* Balance Section */}
      <div>
        <h2>Check Balance</h2>
        <Button bgColor="#008CBA" hoverColor="#007B9E" onClick={handlegetBalance}>
          Get Balance
        </Button>
        <BalanceText>
          <strong>Balance:</strong> {userBalance || 0} ETH
        </BalanceText>
      </div>

      {/* Toast Container for Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
};

export default App;