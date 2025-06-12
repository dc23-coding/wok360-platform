<!-- src/components/TransactionActions.vue -->
<template>
  <div class="transaction-actions">
    <h3>Support the Creator</h3>

    <div class="button-group">
      <button @click="sendDonation">Donate 0.01 ETH</button>
      <button @click="buyItem">Buy Hoodie for 0.05 ETH</button>
    </div>

    <p v-if="statusMessage" class="status">{{ statusMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ethers } from 'ethers'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
const statusMessage = ref('')

const sendDonation = async () => {
  await handleTransaction({
    type: 'donation',
    amount: '0.01',
    message: 'Thanks for the support!'
  })
}

const buyItem = async () => {
  await handleTransaction({
    type: 'purchase',
    amount: '0.05',
    message: 'WC-Bomber Jacket'
  })
}

const handleTransaction = async ({ type, amount, message }) => {
  if (!window.ethereum) return alert('MetaMask not detected.')

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  const walletAddress = await signer.getAddress()

  const tx = {
    to: '0xYourReceiverWalletHere', // replace with your project wallet
    value: ethers.parseEther(amount)
  }

  try {
    const txResponse = await signer.sendTransaction(tx)
    statusMessage.value = `Transaction sent: ${txResponse.hash}`

    // Save transaction to Supabase
    await supabase.from('transactions').insert({
      user_id: auth.user.id,
      email: auth.user.email,
      wallet_address: walletAddress,
      type,
      amount,
      reference_id: txResponse.hash,
      metadata: { note: message },
      status: 'pending'
    })
  } catch (err) {
    console.error('Transaction failed:', err)
    statusMessage.value = 'Transaction failed. Check console.'
  }
}
</script>

<style scoped>
.transaction-actions {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(187, 134, 252, 0.3);
  text-align: center;
}

.button-group {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 10px;
}

button {
  padding: 10px 20px;
  background: #bb86fc;
  border: none;
  border-radius: 5px;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s ease;
}

button:hover {
  background: #9b6efb;
}

.status {
  margin-top: 15px;
  font-size: 0.9rem;
  color: #0ff;
}
</style>