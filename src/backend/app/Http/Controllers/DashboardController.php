<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Validations\DepartmentValidation as DepartmentRequest;

use App\Services\DepartmentService;
use App\Services\TicketService;
use App\Services\UserService;

class DashboardController extends Controller
{
    protected $departmentService;
    protected $ticketService;
    protected $userService;

    public function __construct(DepartmentService $departmentService, TicketService $ticketService, UserService $userService) {

        $this->departmentService = $departmentService;
        $this->ticketService = $ticketService;
        $this->userService = $userService;

        $this->middleware(['auth:api']);
    }

    public function index() {

        $departmentCount = $this->departmentService->getDepartmentCounts();
        $openTicketsCount = $this->ticketService->getTicketCountByStatus('open');
        $closedTicketsCount = $this->ticketService->getTicketCountByStatus('closed');
        $pendingTicketsCount = $this->ticketService->getTicketCountByStatus('in-progress');
        $totalTickets = $this->ticketService->getTicketCounts();
        $urgentTicketsCount = $this->ticketService->getTicketCountByPriority('High');

        $recents = $this->ticketService->getRecentTickets();


        $agentsCount = $this->userService->getUserCountsByRole("agent");
        $clientsCount = $this->userService->getUserCountsByRole("client");

        return response()->json([
            'status' => 'success',
            'data' => [
                'stats'  =>[
                        'departmentCount' => $departmentCount,
                        'openTicketsCount' => $openTicketsCount,
                        'closedTicketsCount' => $closedTicketsCount,
                        'pendingTicketsCount' => $pendingTicketsCount,
                        'urgentTicketsCount' => $urgentTicketsCount,
                        'totalTicketsCount' => $totalTickets,
                        'agentsCount' => $agentsCount,
                        'clientsCount' => $clientsCount,
                ],
                'recents' => $recents
            ]
        ], 200);
    }

     public function agent() {

        $resolved = $this->ticketService->getTicketCountByStatus('resolved');
        $inProgress = $this->ticketService->getTicketCountByStatus('in-progress');
        $totalTickets = $this->ticketService->getTicketCounts();

        $recents = $this->ticketService->getRecentTickets();

        return response()->json([
            'status' => 'success',
            'data' => [
                'stats'  =>[
                        'resolved' => $resolved,
                        'inProgress' => $inProgress,
                        'totalTickets' => $totalTickets,
                ],
                'recents' => $recents
            ]
        ], 200);
    }

}
