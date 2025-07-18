<?php

namespace App\Http\Controllers;

use App\Services\DepartmentService;
use App\Services\TicketService;
use App\Services\UserService;
use App\Validations\DepartmentValidation as DepartmentRequest;
use Illuminate\Http\Request;

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
        $openTicketsCount = $this->ticketService->getTicketCountByStatus('admin','open');
        $closedTicketsCount = $this->ticketService->getTicketCountByStatus('admin','resolved');
        $pendingTicketsCount = $this->ticketService->getTicketCountByStatus('admin','in-progress');
        $totalTickets = $this->ticketService->getTicketCounts('admin');
        $urgentTicketsCount = $this->ticketService->getTicketCountByPriority('admin','High');

        $recents = $this->ticketService->getRecentTickets('admin');


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

     public function userData() {

        $role = auth()->user()->getRoleNames()->first();
        $resolved = $this->ticketService->getTicketCountByStatus($role,'resolved');
        $inProgress = $this->ticketService->getTicketCountByStatus($role,'in-progress');
        $totalTickets = $this->ticketService->getTicketCounts($role);
        $recents = $this->ticketService->getRecentTickets($role);

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
