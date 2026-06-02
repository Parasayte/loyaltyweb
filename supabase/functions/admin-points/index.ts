import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AwardPointsRequest {
  user_id: string;
  amount: number;
  reason: string;
  admin_id: string;
}

interface DeductPointsRequest {
  user_id: string;
  amount: number;
  reason: string;
  admin_id: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const action = new URL(req.url).searchParams.get("action");

      if (action === "award") {
        const { user_id, amount, reason, admin_id } = body as AwardPointsRequest;

        if (!user_id || !amount || amount <= 0) {
          return new Response(
            JSON.stringify({ error: "Invalid parameters" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const data = {
          message: `Points awarded: ${amount} pts (Reason: ${reason})`,
          user_id,
          amount,
          reason,
          timestamp: new Date().toISOString(),
        };

        return new Response(JSON.stringify(data), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      } else if (action === "deduct") {
        const { user_id, amount, reason, admin_id } = body as DeductPointsRequest;

        if (!user_id || !amount || amount <= 0) {
          return new Response(
            JSON.stringify({ error: "Invalid parameters" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const data = {
          message: `Points deducted: ${amount} pts (Reason: ${reason})`,
          user_id,
          amount,
          reason,
          timestamp: new Date().toISOString(),
        };

        return new Response(JSON.stringify(data), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }

      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
