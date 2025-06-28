<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TicketResponse;
use App\Models\Ticket;
use App\Models\User;

class TicketResponseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tickets = Ticket::with(['client', 'assigneduser'])->get();

        foreach ($tickets as $ticket) {
            // Add agent responses
            if ($ticket->assigneduser) {
                $agentResponses = [
                    "Thank you for contacting us. I have received your ticket and will look into this issue immediately.",
                    "I have investigated the issue and found the root cause. I'm working on a solution now.",
                    "Could you please provide additional information about when this issue first occurred?",
                    "I have implemented a fix for this issue. Please test it and let me know if the problem persists.",
                ];

                // Randomly select 1-3 agent responses
                $responseCount = rand(1, 3);
                $selectedResponses = array_rand($agentResponses, min($responseCount, count($agentResponses)));
                
                if (!is_array($selectedResponses)) {
                    $selectedResponses = [$selectedResponses];
                }

                foreach ($selectedResponses as $index => $responseIndex) {
                    TicketResponse::create([
                        'ticket_id' => $ticket->id,
                        'user_id' => $ticket->assigneduser->id,
                        'message' => $agentResponses[$responseIndex],
                        'created_at' => now()->subDays(rand(0, 7))->subHours(rand(0, 23)),
                    ]);
                }
            }

            // Add client responses (follow-ups)
            if ($ticket->client && rand(0, 1)) { // 50% chance of client response
                $clientResponses = [
                    "Thank you for the quick response. I appreciate your help with this matter.",
                    "I tried the suggested solution but the issue still persists. Can you please help further?",
                    "The issue has been resolved. Thank you for your excellent support!",
                    "I have additional questions related to this issue. Could we schedule a call?",
                    "Perfect! The fix worked. You can close this ticket now.",
                ];

                $selectedResponse = $clientResponses[array_rand($clientResponses)];
                
                TicketResponse::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $ticket->client->id,
                    'message' => $selectedResponse,
                    'created_at' => now()->subDays(rand(0, 5))->subHours(rand(0, 23)),
                ]);
            }
        }

        // Add some additional responses for active tickets
        $activeTickets = Ticket::whereIn('status', ['open', 'in_progress'])->get();
        
        foreach ($activeTickets as $ticket) {
            if ($ticket->assigneduser && rand(0, 1)) { // 50% chance of additional response
                $additionalResponses = [
                    "I'm still working on this issue. I'll update you within the next 24 hours.",
                    "I've escalated this to our senior technical team for further assistance.",
                    "Could you please try clearing your browser cache and cookies?",
                    "I've found a temporary workaround while we work on a permanent solution.",
                    "This issue is related to a recent system update. We're rolling out a fix shortly.",
                ];

                TicketResponse::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $ticket->assigneduser->id,
                    'message' => $additionalResponses[array_rand($additionalResponses)],
                    'created_at' => now()->subDays(rand(0, 2))->subHours(rand(0, 12)),
                ]);
            }
        }
    }
}
